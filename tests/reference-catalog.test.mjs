import test from "node:test";
import assert from "node:assert/strict";

test("reference URLs canonicalize YouTube watch, short and tracking variants",async()=>{
  const module=await import("../scripts/reference-catalog.mjs").catch(()=>({}));
  assert.equal(typeof module.canonicalizeReferenceUrl,"function");
  assert.equal(
    module.canonicalizeReferenceUrl("https://youtu.be/abc123?t=42"),
    module.canonicalizeReferenceUrl("https://www.youtube.com/watch?v=abc123&feature=share")
  );
});

test("reference catalog deduplicates canonical videos and reports the remaining 1,000-study gap",async()=>{
  const module=await import("../scripts/reference-catalog.mjs").catch(()=>({}));
  assert.equal(typeof module.analyzeReferenceCatalog,"function");
  const report=module.analyzeReferenceCatalog([
    {id:"R001",url:"https://youtu.be/abc123?t=5",title:"Example",category:"kinetic-typography",evidenceLevel:"L0",eligibleForStyleStudy:true},
    {id:"R002",url:"https://www.youtube.com/watch?v=abc123",title:"Same video",category:"kinetic-typography",evidenceLevel:"L0",eligibleForStyleStudy:true},
    {id:"R003",url:"https://www.youtube.com/watch?v=def456",title:"Watched example",category:"data-viz-infographics",evidenceLevel:"L2",watched:true,eligibleForStyleStudy:true}
  ]);
  assert.equal(report.inputRecords,3);
  assert.equal(report.uniqueCanonicalReferences,2);
  assert.equal(report.duplicateCount,1);
  assert.equal(report.remainingUniqueReferences,998);
  assert.equal(report.evidenceLevelCounts.L2,1);
});

test("reference evidence levels cannot claim reviews that did not happen",async()=>{
  const module=await import("../scripts/reference-catalog.mjs").catch(()=>({}));
  assert.equal(typeof module.analyzeReferenceCatalog,"function");
  const report=module.analyzeReferenceCatalog([
    {id:"R001",url:"https://example.com/video-a",title:"Not watched",category:"kinetic-typography",evidenceLevel:"L2",watched:false},
    {id:"R002",url:"https://example.com/video-b",title:"No timestamps",category:"data-viz-infographics",evidenceLevel:"L3",watched:true,timestampedAnalysis:false},
    {id:"R003",url:"https://example.com/article",title:"Article only",category:"documentary-editorial-explainers",evidenceLevel:"L1",sourceReviewed:false,transcriptReviewed:false}
  ]);
  assert.equal(report.validationErrors.length,3);
});


test("the current 100-reference seed imports without silently dropping rows or inflating evidence",async()=>{
  const module=await import("../scripts/reference-catalog.mjs");
  const {readFile}=await import("node:fs/promises");
  const markdown=await readFile(new URL("../research/REFERENCE_SEED_CATALOG.md",import.meta.url),"utf8");
  const parsed=module.parseSeedCatalog(markdown);
  assert.equal(parsed.records.length,100);
  assert.equal(parsed.skippedLines.length,0);
  assert.equal(parsed.records.filter(record=>record.evidenceLevel==="L0").length,55);
  assert.equal(parsed.records.filter(record=>record.evidenceLevel==="L1").length,45);
  assert.equal(parsed.records.filter(record=>record.watched===true).length,0);
  const relatedArticleOnly=parsed.records.find(record=>record.id==="R005");
  assert.equal(relatedArticleOnly.evidenceLevel,"L0");
  assert.equal(relatedArticleOnly.relatedArticleReviewed,true);
});


test("structured seed catalog preserves the honest current progress toward 1,000 eligible references",async()=>{
  const module=await import("../scripts/reference-catalog.mjs");
  const {readFile}=await import("node:fs/promises");
  const jsonl=await readFile(new URL("../research/references.jsonl",import.meta.url),"utf8");
  const records=jsonl.trim().split(/\r?\n/).map(line=>JSON.parse(line));
  const report=module.analyzeReferenceCatalog(records);
  assert.equal(report.inputRecords,100);
  assert.equal(report.uniqueCanonicalReferences,100);
  assert.equal(report.eligibleUniqueReferences,94);
  assert.equal(report.evidenceLevelCounts.L0,55);
  assert.equal(report.evidenceLevelCounts.L1,45);
  assert.equal(report.evidenceLevelCounts.L2,0);
  assert.equal(report.evidenceLevelCounts.L3,0);
  assert.equal(report.remainingUniqueReferences,906);
  assert.deepEqual(report.validationErrors,[]);
});


test("committed reference progress report is reproducible from the structured catalog",async()=>{
  const module=await import("../scripts/reference-catalog.mjs");
  const {readFile}=await import("node:fs/promises");
  const jsonl=await readFile(new URL("../research/references.jsonl",import.meta.url),"utf8");
  const saved=JSON.parse(await readFile(new URL("../docs/REFERENCE_PROGRESS.json",import.meta.url),"utf8"));
  const records=jsonl.trim().split(/\r?\n/).map(line=>JSON.parse(line));
  assert.deepEqual(saved,module.analyzeReferenceCatalog(records,{generatedAt:saved.generatedAt}));
});
