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
