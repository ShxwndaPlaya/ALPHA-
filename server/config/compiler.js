// =====================================
// ALPHA LAN — Local Code Compiler Config
// =====================================

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logInfo, logError } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory for temporary code execution
const SANDBOX_DIR = path.join(__dirname, "../../sandbox");

// Ensure sandbox folder exists
if (!fs.existsSync(SANDBOX_DIR)) {
  fs.mkdirSync(SANDBOX_DIR, { recursive: true });
  logInfo("🧰 Sandbox directory created");
}

/**
 * Executes code for a specific language in local sandbox.
 * @param {string} language - Language name (e.g. "python", "c", "cpp", "java", "js")
 * @param {string} code - The source code string
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
export async function compileAndRun(language, code) {
  return new Promise((resolve) => {
    const timestamp = Date.now();
    const fileBase = `code_${timestamp}`;
    let filename, command;

    // Determine language setup
    switch (language.toLowerCase()) {
      case "python":
        filename = `${fileBase}.py`;
        command = `python3 ${filename}`;
        break;

      case "c":
        filename = `${fileBase}.c`;
        command = `gcc ${filename} -o ${fileBase} && ./${fileBase}`;
        break;

      case "cpp":
        filename = `${fileBase}.cpp`;
        command = `g++ ${filename} -o ${fileBase} && ./${fileBase}`;
        break;

      case "java":
        filename = `${fileBase}.java`;
        command = `javac ${filename} && java ${fileBase}`;
        break;

      case "js":
      case "javascript":
        filename = `${fileBase}.js`;
        command = `node ${filename}`;
        break;

      default:
        resolve({ stdout: "", stderr: `Unsupported language: ${language}` });
        return;
    }

    // Create code file
    const filePath = path.join(SANDBOX_DIR, filename);
    fs.writeFileSync(filePath, code);

    // Execute inside sandbox
    exec(
      command,
      { cwd: SANDBOX_DIR, timeout: 5000 },
      (error, stdout, stderr) => {
        // Cleanup
        cleanupFiles(fileBase, language);

        if (error && error.killed) {
          stderr = "⏱️ Execution timed out (limit 5s)";
        }

        resolve({
          stdout: stdout || "",
          stderr: stderr || error?.message || "",
        });
      }
    );
  });
}

/**
 * Cleanup generated files after execution
 */
function cleanupFiles(base, language) {
  try {
    const extensions = [".py", ".c", ".cpp", ".java", ".class", "", ".js"];
    extensions.forEach((ext) => {
      const file = path.join(SANDBOX_DIR, `${base}${ext}`);
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
  } catch (err) {
    logError("Cleanup error:", err);
  }
}
