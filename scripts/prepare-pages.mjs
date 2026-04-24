import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const docsDir = resolve(process.cwd(), "docs");
const sourceFile = resolve(docsDir, "index.html");
const fallbackFile = resolve(docsDir, "404.html");

await copyFile(sourceFile, fallbackFile);

console.log("Prepared docs/404.html for GitHub Pages SPA fallback.");
