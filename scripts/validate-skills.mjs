import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const roots = [
  { root: ".agents/skills", minimum: 19 },
  { root: ".claude/skills", minimum: 5 },
];
const errors = [];
const tick = String.fromCharCode(96);

for (const config of roots) {
  let entries;
  try {
    entries = await readdir(config.root, { withFileTypes: true });
  } catch {
    errors.push(config.root + ": missing skill root");
    continue;
  }

  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  if (directories.length < config.minimum) {
    errors.push(config.root + ": expected at least " + config.minimum + " skill directories, found " + directories.length + ".");
  }

  const seenNames = new Set();
  for (const directory of directories) {
    const path = join(config.root, directory, "SKILL.md");
    let content;
    try {
      content = await readFile(path, "utf8");
    } catch {
      errors.push(path + ": missing SKILL.md");
      continue;
    }
    const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!frontmatter) {
      errors.push(path + ": missing YAML frontmatter");
      continue;
    }
    const name = frontmatter[1].match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
    const description = frontmatter[1].match(/^description:\s*(.+?)\s*$/m)?.[1];
    if (!name) errors.push(path + ": missing or invalid name field");
    if (!description || description.length < 20) errors.push(path + ": description must be at least 20 characters");
    if (name && name !== directory) errors.push(path + ": name must match directory '" + directory + "'");
    if (name && seenNames.has(name)) errors.push(path + ": duplicate skill name '" + name + "'");
    if (name) seenNames.add(name);
    if (!content.split(/\r?\n/).some((line) => /^#{1,6}\s+/.test(line))) errors.push(path + ": expected at least one Markdown heading");
  }

  const indexPath = join(config.root, "README.md");
  let index;
  try {
    index = await readFile(indexPath, "utf8");
  } catch {
    errors.push(indexPath + ": missing skill index");
    continue;
  }
  for (const directory of directories) {
    if (!index.includes(tick + directory + tick)) {
      errors.push(indexPath + ": missing catalogue entry for '" + directory + "'");
    }
  }
}

if (errors.length) {
  console.error("Agent Skills validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exitCode = 1;
} else {
  console.log("Validated both skill roots: frontmatter, names, descriptions, headings and index coverage are consistent.");
}
