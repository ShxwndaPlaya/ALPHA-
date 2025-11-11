// =====================================
// ALPHA LAN — Local Compiler Service
// =====================================
//
// Executes code for multiple languages securely
// in a LAN sandbox environment.
//
// Supported languages:
//   - Python
//   - C
//   - C++
//   - Java
//   - JavaScript
//
// =====================================

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import os from "os";

const TEMP_DIR = path.join(os.tmpdir(), "alpha-lan-sandbox");

// Ensure sandbox directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Timeout for code execution (in ms)
const EXEC_TIMEOUT = 5000;

// -------------------------------------
// @desc    Safely execute shell command
// -------------------------------------
const runCommand = (command, cwd) =>
  new Promise((resolve, reject) => {
    exec(command, { cwd, timeout: EXEC_TIMEOUT }, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }
      resolve(stdout || stderr);
    });
  });

// -------------------------------------
// @desc    Compile & run code
// @param   {string} language - python | c | cpp | java | js
// @param   {string} sourceCode
// -------------------------------------
export const compileAndRun = async (language, sourceCode) => {
  const sessionId = uuidv4();
  const workDir = path.join(TEMP_DIR, sessionId);
  fs.mkdirSync(workDir, { recursive: true });

  try {
    let result;
    switch (language.toLowerCase()) {
      case "python": {
        const filePath = path.join(workDir, "main.py");
        fs.writeFileSync(filePath, sourceCode);
        result = await runCommand(`python3 ${filePath}`, workDir);
        break;
      }

      case "javascript":
      case "js": {
        const filePath = path.join(workDir, "main.js");
        fs.writeFileSync(filePath, sourceCode);
        result = await runCommand(`node ${filePath}`, workDir);
        break;
      }

      case "c": {
        const filePath = path.join(workDir, "main.c");
        fs.writeFileSync(filePath, sourceCode);
        await runCommand(`gcc main.c -o main.out`, workDir);
        result = await runCommand(`./main.out`, workDir);
        break;
      }

      case "cpp":
      case "c++": {
        const filePath = path.join(workDir, "main.cpp");
        fs.writeFileSync(filePath, sourceCode);
        await runCommand(`g++ main.cpp -o main.out`, workDir);
        result = await runCommand(`./main.out`, workDir);
        break;
      }

      case "java": {
        const filePath = path.join(workDir, "Main.java");
        fs.writeFileSync(filePath, sourceCode);
        await runCommand(`javac Main.java`, workDir);
        result = await runCommand(`java Main`, workDir);
        break;
      }

      default:
        throw new Error("Unsupported language");
    }

    return {
      success: true,
      output: result.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString().slice(0, 1000), // prevent overload
    };
  } finally {
    // Clean up session folder
    fs.rmSync(workDir, { recursive: true, force: true });
  }
};
