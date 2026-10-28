import test from "node:test";
import assert from "node:assert/strict";
import { searchOpus55Catalog } from "../src/production/opus55-reference-library.mjs";
import { parseArgs } from "../scripts/produce.mjs";

const catalog = [
  { slug: "ui-morph", author: "one", category: "motion", tech_tags: ["svg", "gsap"], prompt: "Create a looping UI morph with spring motion." },
  { slug: "science-explainer", author: "two", category: "explainer", tech_tags: ["canvas"], prompt: "Explain solar energy using animated diagrams." },
  { slug: "3d-product", author: "three", category: "product", tech_tags: ["threejs"], prompt: "Render a premium product in a 3D scene." }
];

test("Opus 5.5 search ranks category and tags above incidental prompt matches", () => {
  const result = searchOpus55Catalog(catalog, "svg motion");
  assert.equal(result[0].slug, "ui-morph");
});

test("Opus 5.5 search is case-insensitive and returns no results for empty queries", () => {
  assert.equal(searchOpus55Catalog(catalog, "SOLAR").some((item) => item.slug === "science-explainer"), true);
  assert.deepEqual(searchOpus55Catalog(catalog, "   "), []);
});

test("Opus 5.5 search bounds result count", () => {
  assert.ok(searchOpus55Catalog(catalog, "motion", 10000).length <= 100);
});

test("production CLI accepts a selected Opus 5.5 reference slug", () => {
  const options = parseArgs(["--topic", "Solar power", "--language", "en", "--opus55-reference", "science-explainer"]);
  assert.equal(options.opus55Reference, "science-explainer");
});

test("production CLI rejects malformed Opus 5.5 reference slugs", () => {
  assert.throws(() => parseArgs(["--topic", "Solar power", "--language", "en", "--opus55-reference", "../secrets"]), /valid dataset slug/);
});
