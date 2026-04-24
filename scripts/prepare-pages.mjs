import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const sourceFile = resolve(distDir, "index.html");
const fallbackFile = resolve(distDir, "404.html");

await copyFile(sourceFile, fallbackFile);

console.log("Prepared dist/404.html for GitHub Pages SPA fallback.");
