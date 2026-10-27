import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = ".agents/skills";
const entries = await readdir(root, { withFileTypes: true });
const skillDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
const errors = [];
const seenNames = new Set();

if (skillDirs.length < 19) {
  errors.push(`Expected at least 19 skill directories, found ${skillDirs.length}.`);
}

for (const directory of skillDirs) {
  const path = join(root, directory, "SKILL.md");
  let content;

  try {
    content = await readFile(path, "utf8");
  } catch {
    errors.push(`${path}: missing SKILL.md`);
    continue;
  }

  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) {
    errors.push(`${path}: missing YAML frontmatter`);
    continue;
  }

  const name = frontmatter[1].match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const description = frontmatter[1].match(/^description:\s*(.+?)\s*$/m)?.[1];

  if (!name) errors.push(`${path}: missing or invalid name field`);
  if (!description || description.length < 20) errors.push(`${path}: description must be at least 20 characters`);
  if (name && name !== directory) errors.push(`${path}: name '${name}' must match directory '${directory}'`);
  if (name && seenNames.has(name)) errors.push(`${path}: duplicate skill name '${name}'`);
  if (name) seenNames.add(name);
  if (!/^#{1,6}\\s+/m.test(content)) errors.push(`${path}: expected at least one Markdown heading`);
}

const index = await readFile(join(root, "README.md"), "utf8");
for (const directory of skillDirs) {
  if (!index.includes(`\`${directory}\``)) {
    errors.push(`.agents/skills/README.md: missing catalogue entry for '${directory}'`);
  }
}

if (errors.length) {
  console.error("Agent Skills validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${skillDirs.length} Agent Skills: frontmatter, names, descriptions, sections, and index entries are consistent.`);
}
