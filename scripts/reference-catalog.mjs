import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const TARGET_UNIQUE_REFERENCES = 1000;
export const REFERENCE_TARGET_QUOTAS = Object.freeze({
  "educational-science-explainers": 200,
  "documentary-editorial-explainers": 150,
  "data-viz-infographics": 100,
  "kinetic-typography": 100,
  "2d-character-shape": 100,
  "3d-2.5d-motion-design": 100,
  "maps-timelines-history": 75,
  "product-tech-explainers": 75,
  "brand-logo-motion": 50,
  "vertical-social-explainers": 50
});

const TRACKING_PARAMS = /^(utm_.+|si|feature|t|start|pp|ab_channel|ref|source|fbclid|gclid|mc_cid|mc_eid)$/i;
const TOOLING_ONLY = /\b(workflow\/tools|workflow|tutorial|plugins?|tool research|install another|claude code)\b/i;

export function canonicalizeReferenceUrl(rawUrl) {
  const url = new URL(String(rawUrl || "").trim());
  url.hash = "";
  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com") {
    let videoId = "";
    if (host === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    else if (url.pathname === "/watch") videoId = url.searchParams.get("v") || "";
    else {
      const parts = url.pathname.split("/").filter(Boolean);
      if (["shorts", "embed", "live", "v"].includes(parts[0])) videoId = parts[1] || "";
    }
    if (videoId) return "https://www.youtube.com/watch?v=" + encodeURIComponent(videoId);
  }

  url.protocol = "https:";
  url.hostname = host;
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString();
}

function categoryForSeed(categoryText, title) {
  const value = (String(categoryText || "") + " " + String(title || "")).toLowerCase();
  if (/workflow\/tools|claude workflow|tutorial|plugins?/.test(value)) return "workflow-tooling-not-style-sample";
  if (/kinetic|typography|type design|title sequence/.test(value)) return "kinetic-typography";
  if (/data|chart|infographic|visual narrative/.test(value)) return "data-viz-infographics";
  if (/character|shape animation|2d vector|2d animation/.test(value)) return "2d-character-shape";
  if (/3d|2\.5d|cgi|product render/.test(value)) return "3d-2.5d-motion-design";
  if (/map|timeline|history|geographic/.test(value)) return "maps-timelines-history";
  if (/brand|logo|identity motion/.test(value)) return "brand-logo-motion";
  if (/vertical|social|shorts|reels/.test(value)) return "vertical-social-explainers";
  if (/product|technology|tech demo|saas|software|ui animation|interface/.test(value)) return "product-tech-explainers";
  if (/documentary|editorial|archive|mixed media|motion reel|showreel|brand story/.test(value)) return "documentary-editorial-explainers";
  return "educational-science-explainers";
}

export function parseSeedCatalog(markdown, captureDate = "2026-10-28") {
  const records = [];
  const skippedLines = [];
  const rowPattern = /^\|\s*(R\d{3})\s*\|\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)(?:\s*·\s*([^|]+))?\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.*?)\s*\|$/;
  for (const line of String(markdown || "").split(/\r?\n/)) {
    if (!/^\|\s*R\d{3}\s*\|/.test(line)) continue;
    const match = line.match(rowPattern);
    if (!match) {
      skippedLines.push(line);
      continue;
    }
    const [, id, title, url, creator = "", rawCategory, evidenceText, notes] = match;
    const evidenceLevel = /\bL1\b/.test(evidenceText) ? "L1" : "L0";
    const category = categoryForSeed(rawCategory, title);
    records.push({
      id,
      url,
      title: title.trim(),
      creator: creator.trim() || "unknown",
      category,
      evidenceLevel,
      sourceReviewed: evidenceLevel === "L1",
      transcriptReviewed: false,
      watched: false,
      timestampedAnalysis: false,
      eligibleForStyleStudy: category !== "workflow-tooling-not-style-sample",
      captureDate,
      notes: notes.trim()
    });
  }
  return { records, skippedLines };
}

export function analyzeReferenceCatalog(records, options = {}) {
  const targetUniqueReferences = Number(options.targetUniqueReferences) > 0
    ? Math.floor(Number(options.targetUniqueReferences))
    : TARGET_UNIQUE_REFERENCES;
  const quotas = options.targetQuotas || REFERENCE_TARGET_QUOTAS;
  const validationErrors = [];
  const duplicates = [];
  const seenIds = new Map();
  const seenUrls = new Map();
  const uniqueRecords = [];

  for (let index = 0; index < records.length; index++) {
    const record = records[index] || {};
    const label = String(record.id || "row-" + (index + 1));
    const evidence = record.evidenceLevel;
    if (!record.id) validationErrors.push(label + ": missing stable id.");
    if (!record.title) validationErrors.push(label + ": missing title.");
    if (!record.url) validationErrors.push(label + ": missing source URL.");
    if (!Object.hasOwn({ L0: 1, L1: 1, L2: 1, L3: 1 }, evidence)) {
      validationErrors.push(label + ": evidenceLevel must be L0, L1, L2 or L3.");
    } else if (evidence === "L1" && !(record.sourceReviewed || record.articleReviewed || record.transcriptReviewed)) {
      validationErrors.push(label + ": L1 requires a reviewed article, source page or transcript.");
    } else if (evidence === "L2" && record.watched !== true) {
      validationErrors.push(label + ": L2 requires watched=true.");
    } else if (evidence === "L3" && !(record.watched === true && record.timestampedAnalysis === true)) {
      validationErrors.push(label + ": L3 requires watched=true and timestampedAnalysis=true.");
    }

    if (record.id && seenIds.has(record.id)) {
      validationErrors.push(label + ": duplicate record id already used by " + seenIds.get(record.id) + ".");
    } else if (record.id) seenIds.set(record.id, label);

    let canonicalUrl = "";
    try {
      canonicalUrl = canonicalizeReferenceUrl(record.url);
    } catch {
      validationErrors.push(label + ": invalid source URL.");
    }
    if (!canonicalUrl) continue;
    if (seenUrls.has(canonicalUrl)) {
      duplicates.push({ id: label, duplicateOf: seenUrls.get(canonicalUrl), canonicalUrl });
      continue;
    }
    seenUrls.set(canonicalUrl, label);
    uniqueRecords.push({ ...record, canonicalUrl });
  }

  const evidenceLevelCounts = { L0: 0, L1: 0, L2: 0, L3: 0 };
  const categoryCounts = {};
  for (const record of uniqueRecords) {
    if (Object.hasOwn(evidenceLevelCounts, record.evidenceLevel)) evidenceLevelCounts[record.evidenceLevel]++;
    if (record.eligibleForStyleStudy !== false) {
      categoryCounts[record.category] = (categoryCounts[record.category] || 0) + 1;
    }
  }
  const eligibleUniqueReferences = uniqueRecords.filter(record => record.eligibleForStyleStudy !== false).length;
  const quotaProgress = Object.entries(quotas).map(([category, target]) => ({
    category,
    target,
    current: categoryCounts[category] || 0,
    remaining: Math.max(0, target - (categoryCounts[category] || 0))
  }));

  return {
    generatedAt: options.generatedAt || new Date().toISOString(),
    targetUniqueReferences,
    inputRecords: records.length,
    uniqueCanonicalReferences: uniqueRecords.length,
    eligibleUniqueReferences,
    duplicateCount: duplicates.length,
    duplicates,
    evidenceLevelCounts,
    categoryCounts,
    remainingUniqueReferences: Math.max(0, targetUniqueReferences - eligibleUniqueReferences),
    quotaProgress,
    validationErrors
  };
}

async function readJsonl(path) {
  const text = await readFile(path, "utf8");
  return text.split(/\r?\n/).map((line, index) => ({ line: line.trim(), index }))
    .filter(item => item.line && !item.line.startsWith("#"))
    .map(({ line, index }) => {
      try { return JSON.parse(line); }
      catch (error) { throw new Error(path + ":" + (index + 1) + ": invalid JSONL: " + error.message); }
    });
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--import-seed") {
    const input = resolve(args[1] || "research/REFERENCE_SEED_CATALOG.md");
    const output = resolve(args[2] || "research/references.jsonl");
    const parsed = parseSeedCatalog(await readFile(input, "utf8"));
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, parsed.records.map(record => JSON.stringify(record)).join("\n") + "\n");
    console.log(JSON.stringify({ imported: parsed.records.length, skippedRows: parsed.skippedLines.length, output }, null, 2));
    if (parsed.skippedLines.length) process.exitCode = 1;
    return;
  }
  const input = resolve(args[0] || "research/references.jsonl");
  const output = resolve(args[1] || "docs/REFERENCE_PROGRESS.json");
  const records = await readJsonl(input);
  const report = analyzeReferenceCatalog(records);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({
    inputRecords: report.inputRecords,
    uniqueCanonicalReferences: report.uniqueCanonicalReferences,
    eligibleUniqueReferences: report.eligibleUniqueReferences,
    remainingUniqueReferences: report.remainingUniqueReferences,
    duplicateCount: report.duplicateCount,
    validationErrors: report.validationErrors.length,
    report: output
  }, null, 2));
  if (report.validationErrors.length) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
}
