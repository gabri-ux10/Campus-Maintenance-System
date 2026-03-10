import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const viteBin = resolve(rootDir, "node_modules", "vite", "bin", "vite.js");
const child = spawn(
  process.execPath,
  [viteBin, "--host", "127.0.0.1", "--port", "4173"],
  {
    cwd: rootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_TURNSTILE_SITE_KEY: process.env.VITE_TURNSTILE_SITE_KEY || "playwright-site-key",
      VITE_TURNSTILE_TEST_TOKEN: process.env.VITE_TURNSTILE_TEST_TOKEN || "playwright-captcha-token",
    },
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
