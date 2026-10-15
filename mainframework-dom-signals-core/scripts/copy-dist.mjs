import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const targetArg = process.argv[2];
if (!targetArg) {
  console.error("Usage: node copy-dist.mjs <target-directory>");
  process.exit(1);
}

const coreRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distSrc = resolve(coreRoot, "dist");
const targetDir = resolve(process.cwd(), targetArg);

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
cpSync(distSrc, targetDir, { recursive: true });
