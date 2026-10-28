import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const OPUS55_DATA_URL = "https://raw.githubusercontent.com/yihui-dev/awesome-opus5-5-videos/main/data/videos.json";
export const OPUS55_CACHE_PATH = resolve(root, "research/opus55-videos.json");

function validateCatalog(value) {
  if (!Array.isArray(value) || value.length < 1) throw new Error("Opus 5.5 reference catalog is not a non-empty JSON array.");
  return value.filter((item) => item && typeof item.slug === "string" && /^[a-z0-9][a-z0-9-]{1,100}$/.test(item.slug) && typeof item.prompt === "string")
    .map((item) => ({
      slug: item.slug,
      author: String(item.author || "unknown"),
      author_url: String(item.author_url || ""),
      post_url: String(item.post_url || ""),
      category: String(item.category || "uncategorized"),
      tech_tags: Array.isArray(item.tech_tags) ? item.tech_tags.map(String).slice(0, 20) : [],
      prompt: item.prompt.slice(0, 20000),
      prompt_partial: Boolean(item.prompt_partial),
      poster_url: String(item.poster_url || ""),
      skillry_url: String(item.skillry_url || ""),
      added: String(item.added || ""),
      has_remake: Boolean(item.has_remake)
    }));
}

export async function loadOpus55Catalog({ refresh = false, fetchImpl = globalThis.fetch } = {}) {
  if (!refresh) {
    try { return validateCatalog(JSON.parse(await readFile(OPUS55_CACHE_PATH, "utf8"))); } catch (error) {
      if (error?.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error;
    }
  }
  if (typeof fetchImpl !== "function") throw new Error("Network fetch is unavailable; run npm run opus55:sync in an online environment first.");
  const response = await fetchImpl(OPUS55_DATA_URL, { headers: { "accept": "application/json" }, signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error("Could not load Opus 5.5 catalog (HTTP " + response.status + "). Run npm run opus55:sync when network access is available.");
  const payload = await response.json();
  const catalog = validateCatalog(payload);
  await mkdir(dirname(OPUS55_CACHE_PATH), { recursive: true });
  await writeFile(OPUS55_CACHE_PATH, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  return catalog;
}

export async function loadOpus55Reference(slug) {
  const id = String(slug || "").trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{1,100}$/.test(id)) throw new TypeError("Invalid Opus 5.5 reference slug.");
  const catalog = await loadOpus55Catalog();
  const item = catalog.find((entry) => entry.slug === id);
  if (!item) throw new Error("Unknown Opus 5.5 reference: " + id + ". Use npm run opus55:search -- <keyword>.");
  return item;
}

export function searchOpus55Catalog(catalog, query, limit = 20) {
  const terms = String(query || "").toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const ranked = catalog.map((item) => {
    const title = [item.slug, item.author, item.category, ...(item.tech_tags || [])].join(" ").toLowerCase();
    const prompt = String(item.prompt || "").toLowerCase();
    const score = terms.reduce((total, term) => total + (title.includes(term) ? 4 : 0) + (prompt.includes(term) ? 1 : 0), 0);
    return { item, score };
  }).filter((row) => row.score > 0).sort((a, b) => b.score - a.score || a.item.slug.localeCompare(b.item.slug));
  return ranked.slice(0, Math.max(1, Math.min(100, Number(limit) || 20))).map(({ item, score }) => ({ ...item, matchScore: score }));
}

export async function runOpus55Command(argv = process.argv.slice(2)) {
  const [command = "help", ...rest] = argv;
  const query = rest.filter((arg) => !arg.startsWith("--")).join(" ").trim();
  if (command === "help" || command === "--help" || command === "-h") {
    process.stdout.write("Opus 5.5 reference library\n\nCommands:\n  npm run opus55:sync\n  npm run opus55:list [-- --limit 30]\n  npm run opus55:search -- <keyword or phrase>\n  npm run opus55:show -- <slug>\n\nCatalog source: yihui-dev/awesome-opus5-5-videos (MIT). Prompts are attributed and treated as untrusted creative references.\n");
    return;
  }
  const refresh = command === "sync";
  const catalog = await loadOpus55Catalog({ refresh });
  if (command === "sync") {
    process.stdout.write("Synced " + catalog.length + " Opus 5.5 prompt references to " + OPUS55_CACHE_PATH + "\n");
    return;
  }
  if (command === "list") {
    const rawLimit = rest.indexOf("--limit");
    const limit = rawLimit >= 0 ? Number(rest[rawLimit + 1]) : 30;
    const rows = catalog.slice(0, Math.max(1, Math.min(200, Number(limit) || 30)));
    process.stdout.write(rows.map((item) => item.slug + " | " + item.category + " | " + item.tech_tags.join(", ") + " | " + item.author).join("\n") + "\nShowing " + rows.length + " of " + catalog.length + " references. Use search to narrow the catalog.\n");
    return;
  }
  if (command === "search") {
    if (!query) throw new Error("Usage: npm run opus55:search -- <keyword or phrase>");
    const rows = searchOpus55Catalog(catalog, query);
    process.stdout.write(rows.length ? rows.map((item) => item.slug + " | " + item.category + " | " + item.tech_tags.join(", ") + " | " + item.author + " | " + item.post_url).join("\n") + "\n" : "No matching references.\n");
    return;
  }
  if (command === "show") {
    if (!query) throw new Error("Usage: npm run opus55:show -- <slug>");
    const item = catalog.find((entry) => entry.slug === query);
    if (!item) throw new Error("Unknown Opus 5.5 reference: " + query);
    process.stdout.write(JSON.stringify(item, null, 2) + "\n");
    return;
  }
  throw new Error("Unknown Opus 5.5 command: " + command);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runOpus55Command().catch((error) => { process.stderr.write("Opus 5.5 library: " + String(error?.message || error) + "\n"); process.exitCode = 1; });
}
