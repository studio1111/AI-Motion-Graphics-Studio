#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "prompt-library/prompts.json");
const destinationPath = resolve(root, "site/prompt-recipes.json");
const sourceText = await readFile(sourcePath, "utf8");
const catalog = JSON.parse(sourceText);
if (!Array.isArray(catalog.recipes) || catalog.recipes.length !== catalog.count) {
  throw new Error("Prompt catalog count does not match its recipe entries.");
}
const ids = new Set();
for (const recipe of catalog.recipes) {
  if (!recipe || !/^[a-z0-9][a-z0-9-]{1,119}$/.test(recipe.id) ||
      typeof recipe.title !== "string" || !recipe.title.trim() || ids.has(recipe.id)) {
    throw new Error("Prompt catalog contains an invalid or duplicate recipe.");
  }
  ids.add(recipe.id);
}
await writeFile(destinationPath, JSON.stringify(catalog, null, 2) + "\n");
console.log(`Synced ${catalog.recipes.length} prompt recipes to site/prompt-recipes.json.`);
