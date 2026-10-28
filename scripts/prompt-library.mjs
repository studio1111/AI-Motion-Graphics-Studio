#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libraryPath = path.join(root, "prompt-library");
const data = JSON.parse(fs.readFileSync(path.join(libraryPath, "prompts.json"), "utf8"));
const args = process.argv.slice(2);
const command = args[0] ?? "help";
const valueArgs = args.slice(1).filter((arg) => !arg.startsWith("--"));
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const format = flag("--format") ?? "text";
const recipes = data.recipes;

function help() {
  process.stdout.write([
    "Portable Motion Graphics Prompt Library",
    "",
    "Commands:",
    "  npm run prompts:list",
    "  npm run prompts:search -- <keyword>",
    "  npm run prompts:show -- <recipe-id>",
    "  npm run prompts:show -- <recipe-id> --format json",
    "  npm run prompts:master",
    "  npm run prompts:export -- --category product-ui",
    "",
    "Copy the output into any AI assistant or creative tool. Tool capabilities vary."
  ].join("\n") + "\n");
}
function recipeText(r) {
  return [
    "# " + r.title + " (" + r.id + ")",
    "Category: " + r.category + " | Suggested duration: " + r.duration,
    "",
    "## Visual language\n" + r.visual_language,
    "## Motion grammar\n" + r.motion_grammar,
    "## Typography\n" + r.typography,
    "## Color system\n" + r.color_system,
    "## Sound design\n" + r.sound_design,
    "## Story beats\n" + r.story_beats,
    "## Avoid\n" + r.avoid,
    "## Adaptation\n" + r.adaptation
  ].join("\n");
}
function composedPrompt(r) {
  const master = fs.readFileSync(path.join(libraryPath, "MASTER_PROMPT.md"), "utf8").trim();
  return master.replace("{{STYLE_RECIPE}}", recipeText(r)) + "\n\n---\n\n# Selected style recipe\n\n" + recipeText(r);
}

if (command === "help" || command === "--help" || command === "-h") {
  help();
} else if (command === "list") {
  const list = recipes.map((r) => ({id:r.id,title:r.title,category:r.category,duration:r.duration}));
  process.stdout.write(format === "json" ? JSON.stringify(list, null, 2) + "\n" : list.map((r) => `${r.id.padEnd(22)} ${r.title} [${r.category}, ${r.duration}]`).join("\n") + "\n");
} else if (command === "search") {
  const query = valueArgs.join(" ").toLowerCase().trim();
  if (!query) {
    process.stderr.write("Usage: npm run prompts:search -- <keyword>\n");
    process.exitCode = 2;
  } else {
    const found = recipes.filter((r) => JSON.stringify(r).toLowerCase().includes(query));
    process.stdout.write(format === "json" ? JSON.stringify(found.map(({id,title,category,duration})=>({id,title,category,duration})), null, 2) + "\n" : (found.length ? found.map((r)=>`${r.id.padEnd(22)} ${r.title} [${r.category}, ${r.duration}]`).join("\n") : "No matching recipes.") + "\n");
  }
} else if (command === "show") {
  const id = valueArgs[0];
  const r = recipes.find((item) => item.id === id);
  if (!r) {
    process.stderr.write(`Unknown recipe: ${id ?? "(missing)"}. Run npm run prompts:list.\n`);
    process.exitCode = 2;
  } else {
    process.stdout.write(format === "json" ? JSON.stringify({masterPrompt:fs.readFileSync(path.join(libraryPath,"MASTER_PROMPT.md"),"utf8"),recipe:r,readyToCopyPrompt:composedPrompt(r)}, null, 2) + "\n" : composedPrompt(r) + "\n");
  }
} else if (command === "master") {
  process.stdout.write(fs.readFileSync(path.join(libraryPath, "MASTER_PROMPT.md"), "utf8"));
} else if (command === "export") {
  const category = flag("--category");
  const selected = category ? recipes.filter((r) => r.category === category) : recipes;
  if (selected.length === 0) {
    const categories = [...new Set(recipes.map((r) => r.category))].sort().join(", ");
    process.stderr.write(`Unknown prompt category: ${category}. Available categories: ${categories}\\n`);
    process.exitCode = 2;
  } else {
    const masterPrompt = fs.readFileSync(path.join(libraryPath, "MASTER_PROMPT.md"), "utf8").trim();
    if (format === "json") {
      const readyToCopyPrompts = selected.map((r) => ({id:r.id,title:r.title,readyToCopyPrompt:composedPrompt(r)}));
      process.stdout.write(JSON.stringify({schemaVersion:1,category:category ?? null,masterPrompt,recipes:selected,readyToCopyPrompts}, null, 2) + "\\n");
    } else {
      const scope = category ? `Category: ${category} (${selected.length} recipes)` : `All categories (${selected.length} recipes)`;
      const intro = [
        "# Portable Motion Graphics Prompt Bundle",
        "",
        scope,
        "",
        "Copy the universal master prompt and append only one recipe that fits the brief. Use other recipes as references, not as a bundle of conflicting style instructions.",
        "",
        "Tools, APIs, licensing and rendering capabilities depend on the receiving AI environment; this export does not install or activate external services."
      ].join("\\n");
      const reusableMaster = masterPrompt.replace("{{STYLE_RECIPE}}", "Select one recipe from the bundle below and append only that recipe.");
      process.stdout.write([intro, reusableMaster, "## Selected recipe catalog", ...selected.map(recipeText)].join("\\n\\n") + "\\n");
    }
  }
} else {
  process.stderr.write(`Unknown command: ${command}\n`);
  help();
  process.exitCode = 2;
}
