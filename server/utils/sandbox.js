// server/utils/sandbox.js
// Lightweight sandbox wrapper for executing user code locally (LAN).
// - Creates a temp work dir per session
// - Writes source file(s)
// - Executes commands with time & memory limits using `prlimit` + `timeout` when available
// - Cleans up after run
//
// NOTE: This reduces risk but is NOT a substitute for container/VM-based isolation in production.

import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";

const TMP_BASE = path.join(os.tmpdir(), "alpha-lan-sandbox");
if (!fs.existsSync(TMP_BASE)) fs.mkdirSync(TMP_BASE, { recursive: true });

/**
 * Check if an executable exists in PATH (simple)
 */
function whichSync(cmd) {
  try {
    const isWin = process.platform === "win32";
    const which = isWin ? "where" : "which";
    const proc = spawn(which, [cmd]);
    return new Promise((resolve) => {
      proc.on("close", (code) => resolve(code === 0));
      proc.on("error", () => resolve(false));
    });
  } catch {
    return Promise.resolve(false);
  }
}

/**
 * Build command wrapper using prlimit + timeout when available.
 * Returns array form for spawn.
 *
 * - wallTimeSecs: maximum wall-clock seconds
 * - cpuSeconds: maximum CPU seconds (prlimit --cpu)
 * - maxMemoryBytes: address space limit (prlimit --as)
 */
async function buildWrappedCommand(cmdArgs, opts = {}) {
  const { wallTimeSecs = 5, cpuSeconds = 4, maxMemoryBytes = 200 * 1024 * 1024 } = opts;
  const isWin = process.platform === "win32";

  // Prefer prlimit + timeout on unix-like systems
  if (!isWin) {
    const hasPrlimit = await whichSync("prlimit");
    const hasTimeout = await whichSync("timeout");

    // If both exist, construct: timeout <wall>s prlimit --cpu=<cpu> --as=<mem> -- <cmd...>
    if (hasPrlimit && hasTimeout) {
      const full = ["timeout", `${wallTimeSecs}s`, "prlimit", `--cpu=${cpuSeconds}`, `--as=${maxMemoryBytes}`, "--", ...cmdArgs];
      return { cmd: full[0], args: full.slice(1) };
    }

    // If prlimit exists but timeout missing — use prlimit only (no wall-time hard kill)
    if (hasPrlimit) {
      const full = ["prlimit", `--cpu=${cpuSeconds}`, `--as=${maxMemoryBytes}`, "--", ...cmdArgs];
      return { cmd: full[0], args: full.slice(1) };
    }

    // If only timeout exists — use timeout
    if (hasTimeout) {
      const full = ["timeout", `${wallTimeSecs}s`, ...cmdArgs];
      return { cmd: full[0], args: full.slice(1) };
    }

    // fallback: run command directly; we'll enforce wall-time in Node
    return { cmd: cmdArgs[0], args: cmdArgs.slice(1) };
  }

  // Windows fallback: spawn command directly (no prlimit/timeout)
  return { cmd: cmdArgs[0], args: cmdArgs.slice(1) };
}

/**
 * Spawn a process and collect stdout/stderr with timeouts and output limits.
 */
function spawnWithLimits(command, args, cwd, opts = {}) {
  const { wallTimeSecs = 5, maxOutputChars = 20000 } = opts;

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });

    let stdout = "";
    let stderr = "";
    let finished = false;

    const killChild = (reason) => {
      if (finished) return;
      finished = true;
      try { child.kill("SIGKILL"); } catch (e) {}
      resolve({ timedOut: true, reason, stdout, stderr });
    };

    // Wall timeout
    const timer = setTimeout(() => {
      killChild("wall-timeout");
    }, wallTimeSecs * 1000 + 200); // slight padding

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > maxOutputChars) {
        stdout = stdout.slice(0, maxOutputChars) + "\n...[output truncated]";
      }
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > maxOutputChars) {
        stderr = stderr.slice(0, maxOutputChars) + "\n...[error truncated]";
      }
    });

    child.on("error", (err) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve({ timedOut: false, error: err.message, stdout, stderr });
    });

    child.on("close", (code, signal) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve({ timedOut: false, exitCode: code, signal, stdout, stderr });
    });
  });
}

/**
 * Public helper: run code in sandboxed temp directory.
 *
 * language: 'python'|'js'|'c'|'cpp'|'java'
 * sourceFiles: array of { name, content } — multiple files supported (e.g., Java)
 * options:
 *   - wallTimeSecs
 *   - cpuSeconds
 *   - maxMemoryBytes
 *   - maxOutputChars
 */
export async function runInSandbox(language, sourceFiles = [], options = {}) {
  // create temp work dir
  const sessionId = uuidv4();
  const workDir = path.join(TMP_BASE, sessionId);
  fs.mkdirSync(workDir, { recursive: true });

  try {
    // write files
    for (const f of sourceFiles) {
      // sanitize filename (very basic)
      const safeName = path.basename(f.name);
      const fp = path.join(workDir, safeName);
      fs.writeFileSync(fp, f.content, { encoding: "utf8", mode: 0o600 });
    }

    // determine command arguments based on language
    let cmdArgs;
    switch ((language || "").toLowerCase()) {
      case "python":
        cmdArgs = ["python3", "main.py"];
        break;
      case "js":
      case "javascript":
        cmdArgs = ["node", "main.js"];
        break;
      case "c":
        // compile then run: use a small script using sh -c
        // we'll run: sh -c "gcc main.c -o main.out && ./main.out"
        cmdArgs = ["sh", "-c", "gcc main.c -O2 -std=c11 -o main.out 2>compile.err && ./main.out 2>&1 || (cat compile.err && exit 1)"];
        break;
      case "cpp":
      case "c++":
        cmdArgs = ["sh", "-c", "g++ main.cpp -O2 -std=c++17 -o main.out 2>compile.err && ./main.out 2>&1 || (cat compile.err && exit 1)"];
        break;
      case "java":
        // assume one file named Main.java
        cmdArgs = ["sh", "-c", "javac Main.java 2>compile.err && java -cp . Main 2>&1 || (cat compile.err && exit 1)"];
        break;
      default:
        return { success: false, error: `Unsupported language: ${language}` };
    }

    // Build wrapped command (may use prlimit/timeout)
    const { cmd, args } = await buildWrappedCommand(cmdArgs, {
      wallTimeSecs: options.wallTimeSecs ?? 5,
      cpuSeconds: options.cpuSeconds ?? 4,
      maxMemoryBytes: options.maxMemoryBytes ?? 200 * 1024 * 1024,
    });

    // Execute
    const result = await spawnWithLimits(cmd, args, workDir, {
      wallTimeSecs: options.wallTimeSecs ?? 5,
      maxOutputChars: options.maxOutputChars ?? 20000,
    });

    // Normalize response
    if (result.timedOut) {
      return {
        success: false,
        error: "Execution timed out",
        stdout: result.stdout,
        stderr: result.stderr,
      };
    }

    if (result.error) {
      return { success: false, error: result.error, stdout: result.stdout, stderr: result.stderr };
    }

    // exitCode non-zero -> treat as failure but still return outputs
    if (typeof result.exitCode === "number" && result.exitCode !== 0) {
      return {
        success: false,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
      };
    }

    return { success: true, stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode || 0 };
  } catch (err) {
    return { success: false, error: err.message || String(err) };
  } finally {
    // cleanup: remove workDir
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
    } catch (e) {
      // non-fatal
      /* eslint-disable no-console */
      console.warn("Sandbox cleanup failed:", e?.message || e);
    }
  }
}
