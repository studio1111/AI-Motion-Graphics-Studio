import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { allocateFrames, buildLocalPlan, chooseStyle, createProceduralBedWav, detectTopicVisualFamily, normalizePlan, parseArgs, parsePeakVolumeDb, safeSlug, sampleTimes, splitCaptionSegments, validateStoryboard, validateVoiceGeneration, wavDuration } from "../scripts/produce.mjs";

test("topic-aware scene graphics remain wired into the Remotion composition",async()=>{
  const motion=await readFile(new URL("../src/production/MotionVideo.tsx",import.meta.url),"utf8");
  assert.match(motion,/const TopicSceneGraphic:/);
  assert.match(motion,/isCity && stage === "flow"/);
  assert.match(motion,/family === "artificial-intelligence" && stage === "feedback"/);
  assert.match(motion,/family === "solar-energy" && stage === "storage"/);
  assert.match(motion,/return <TopicSceneGraphic scene=\{scene\} family=\{visualFamily\}/);
});

test("manual workflow defaults to local narration without enabling paid AI",async()=>{
  const workflow=await readFile(new URL("../.github/workflows/produce-video.yml",import.meta.url),"utf8");
  const paidBlock=workflow.match(/allow_paid_ai:\n([\s\S]*?)(?=\n      [a-z_]+:|\n\s*permissions:)/)?.[1]||"";
  const voiceBlock=workflow.match(/generate_voice:\n([\s\S]*?)(?=\n      [a-z_]+:|\n\s*permissions:)/)?.[1]||"";
  assert.match(paidBlock,/default:\s*["']?false["']?/,"paid API access must be opt-in");
  assert.match(voiceBlock,/default:\s*true/,"local narration should be on by default");
  assert.match(workflow,/MOTION_STUDIO_ALLOW_PAID_API:\s*\$\{\{\s*inputs\.allow_paid_ai\s*\}\}/);
  assert.match(workflow,/MOTION_STUDIO_VOICE:\s*\$\{\{[\s\S]*inputs\.generate_voice/);
  assert.match(workflow,/inputs\.language\s*==\s*'fa'[\s\S]*persian-speech/i);
  assert.match(workflow,/pocket-tts/i);
});

test("topic visual classifier selects a safe, relevant illustration family",()=>{
  const cases=[
    ["How heat moves through a city","city-heat"],
    ["A city transit system","city"],
    ["Urban design and walkable streets","city"],
    ["Artificial intelligence and neural networks","artificial-intelligence"],
    ["How solar energy becomes electricity","solar-energy"],
    ["Climate change and carbon emissions","climate"],
    ["How DNA and cells work","biology"],
    ["How planets orbit stars","space"],
    ["Inflation and the economy","finance"],
    ["Encryption and cyber security","cybersecurity"],
    ["The water cycle and rainfall","water"],
    ["A story about curiosity","general"],
    ["حرکت گرما در شهر","city-heat"],
    ["هوش مصنوعی و یادگیری ماشین","artificial-intelligence"]
  ];
  for(const [topic,expected] of cases)assert.equal(detectTopicVisualFamily(topic),expected,topic);
});

test("known-topic local fallback uses a coherent, localized eight-scene narrative",()=>{
  const en=buildLocalPlan({topic:"How heat moves through a city",language:"en",styleId:"scientific-2-5d",totalFrames:360,fps:30});
  assert.equal(en.contentMode,"conceptual_topic_template");
  assert.equal(en.scenes[0].title,"How heat moves through a city");
  assert.equal(en.scenes[1].title,"Sunlight meets the street");
  assert.match(en.scenes[2].narration,/conceptual model/i);
  assert.equal(en.scenes[6].title,"Find a cooler route");
  assert.equal(en.scenes.length,8);
  assert.equal(en.scenes.reduce((sum,s)=>sum+s.durationInFrames,0),360);
  const fa=buildLocalPlan({topic:"گرما در شهر چگونه حرکت می‌کند",language:"fa",styleId:"scientific-2-5d",totalFrames:360,fps:30});
  assert.equal(fa.contentMode,"conceptual_topic_template");
  assert.equal(fa.scenes[0].title,"گرما در شهر چگونه حرکت می‌کند");
  assert.equal(fa.scenes[1].title,"نور خورشید به خیابان می‌رسد");
  assert.match(fa.scenes[2].narration,/مدل مفهومی/);
  assert.equal(fa.scenes.length,8);
  assert.equal(fa.scenes.reduce((sum,s)=>sum+s.durationInFrames,0),360);
  const ai=buildLocalPlan({topic:"Artificial intelligence and neural networks",language:"en",styleId:"scientific-2-5d",totalFrames:360,fps:30});
  assert.equal(ai.scenes[1].title,"Signals become examples");
  assert.match(ai.scenes[3].narration,/not automatically correct/i);
  const solar=buildLocalPlan({topic:"How solar energy becomes electricity",language:"fa",styleId:"scientific-2-5d",totalFrames:360,fps:30});
  assert.equal(solar.scenes[1].title,"نور به سلول‌ها می‌رسد");
});

test("local fallback creates eight scenes and varies visual layouts",()=>{
  const plan=buildLocalPlan({topic:"دگرگونی اقلیم",language:"fa",styleId:"scientific-2-5d",totalFrames:2700,fps:30});
  assert.equal(plan.scenes.length,8);
  assert.equal(plan.contentMode,"conceptual_template");
  assert.equal(plan.scenes[0].title,"دگرگونی اقلیم");
  assert.equal(plan.scenes.reduce((sum,s)=>sum+s.durationInFrames,0),2700);
  assert.ok(new Set(plan.scenes.map(s=>s.layout)).size>=5);
  assert.ok(plan.scenes.every(s=>s.sourceRefs.length===0));
  assert.match(plan.scenes[5].narration,/داده|آمار/);
});

test("frame allocator fills target duration exactly with positive durations",()=>{
  for(const [count,total] of [[8,2700],[4,120],[6,1800],[12,360]]){
    const draft=Array.from({length:count},(_,i)=>({title:"Scene "+i,body:"A different scene description.",narration:"Explain the idea clearly."}));
    const frames=allocateFrames(draft,total,30);
    assert.equal(frames.reduce((a,b)=>a+b,0),total);
    assert.ok(frames.every(v=>Number.isInteger(v)&&v>0));
  }
});

test("automatic style selection considers topic and target format",()=>{
  assert.equal(chooseStyle("auto","Population statistics and data","16:9"),"data-journalism");
  assert.equal(chooseStyle("auto","Quantum physics","16:9"),"scientific-2-5d");
  assert.equal(chooseStyle("auto","Any topic","9:16"),"vertical-social");
  assert.equal(chooseStyle("documentary","Any topic","16:9"),"cinematic-documentary");
  assert.throws(()=>chooseStyle("unregistered-style","Topic"),/Unknown style/);
});

test("storyboard validator catches duplicate IDs and unknown layouts",()=>{
  const plan=buildLocalPlan({topic:"Test topic",language:"en",styleId:"cinematic-documentary",totalFrames:240,fps:30});
  plan.scenes[1].id=plan.scenes[0].id;
  plan.scenes[2].layout="teleport";
  const errors=validateStoryboard(plan);
  assert.ok(errors.some(e=>e.includes("Duplicate scene id")));
  assert.ok(errors.some(e=>e.includes("layout is invalid")));
});

test("normalizer removes source references that were not supplied",()=>{
  const base=buildLocalPlan({topic:"Source integrity",language:"en",styleId:"cinematic-documentary",totalFrames:240,fps:30});
  base.scenes[0].sourceRefs=["https://invented.example/fact","https://trusted.example/article"];
  const normalized=normalizePlan(base,{topic:"Source integrity",language:"en",styleId:"cinematic-documentary",fps:30,totalFrames:240,duration:8,aspectRatio:"16:9",sources:[{url:"https://trusted.example/article",title:"Supplied source",description:"",markdown:""}]});
  assert.deepEqual(normalized.scenes[0].sourceRefs,["https://trusted.example/article"]);
  assert.equal(normalized.scenes.reduce((sum,s)=>sum+s.durationInFrames,0),240);
});

test("paid provider calls are disabled by default",()=>{
  const options=parseArgs([],{});
  assert.equal(options.allowPaidAI,false);
  assert.equal(options.language,"fa");
  const opted=parseArgs(["--topic","Solar science","--allow-paid-ai","--plan-only"],{});
  assert.equal(opted.allowPaidAI,true);
  assert.equal(opted.planOnly,true);
  assert.equal(opted.topic,"Solar science");
  assert.equal(parseArgs(["--voice","persian-speech"],{}).voice,"persian-speech");
  assert.throws(()=>parseArgs(["--mystery"],{}),/Unknown option/);
});

test("local fallback keeps copy in every supported output language",()=>{
  const expected={
    fa:"مسئله را از نزدیک ببینیم",
    en:"See the problem up close",
    de:"Das Problem aus der Nähe betrachten",
    es:"Miremos el problema de cerca",
    fr:"Voir le problème de près",
    it:"Guardiamo il problema da vicino",
    pt:"Veja o problema de perto",
    nl:"Bekijk het probleem van dichtbij"
  };
  for(const [language,title] of Object.entries(expected)){
    const plan=buildLocalPlan({topic:"Test topic",language,styleId:"cinematic-documentary",totalFrames:240,fps:30});
    assert.equal(plan.languageUsed,language);
    assert.equal(plan.languageFallback,null);
    assert.equal(plan.scenes.length,8);
    assert.equal(plan.scenes[1].title,title);
    assert.equal(plan.scenes.reduce((sum,scene)=>sum+scene.durationInFrames,0),240);
  }
});

test("CLI accepts documented language codes and rejects unsupported ones",()=>{
  assert.equal(parseArgs(["--language","de-DE"],{}).language,"de");
  assert.equal(parseArgs(["--language","fa"],{}).language,"fa");
  assert.throws(()=>parseArgs(["--language","xx"],{}),/Language must be one of/);
});

test("output slug is path-safe",()=>{
  const slug=safeSlug("../../my dangerous: topic");
  assert.ok(slug.length>0&&slug.length<=48);
  assert.ok(!slug.includes("/")&&!slug.includes("\\"));
  assert.equal(safeSlug("***"),"motion-video");
});

test("requested narration blocks silent or partially narrated production",()=>{
  assert.deepEqual(validateVoiceGeneration("off",{status:"disabled",generatedScenes:0}),[]);
  assert.deepEqual(validateVoiceGeneration("auto",{status:"generated",generatedScenes:8}),[]);
  assert.match(validateVoiceGeneration("auto",{status:"not_installed",generatedScenes:0})[0],/Refusing to deliver a silent or partially narrated video/);
  assert.match(validateVoiceGeneration("pocket-tts",{status:"partial",generatedScenes:3})[0],/generated scenes: 3/);
  assert.match(validateVoiceGeneration("auto",null)[0],/status: missing/);
});

test("audio peak parser accepts measured levels and handles silence safely",()=>{
  assert.equal(parsePeakVolumeDb("[Parsed_volumedetect] max_volume: -14.2 dB"),-14.2);
  assert.equal(parsePeakVolumeDb("max_volume: 0.0 dB"),0);
  assert.equal(parsePeakVolumeDb("max_volume: -inf dB"),-Infinity);
  assert.equal(parsePeakVolumeDb("no measurement"),null);
});

test("procedural music bed is valid stereo PCM with a varied, non-silent waveform",()=>{
  const wav=createProceduralBedWav(5,"scientific-2-5d");
  assert.equal(wav.toString("ascii",0,4),"RIFF");
  assert.equal(wav.toString("ascii",8,12),"WAVE");
  assert.equal(wav.readUInt16LE(22),2);
  assert.equal(wav.readUInt32LE(24),24000);
  assert.equal(wav.readUInt16LE(34),16);
  assert.equal(wavDuration(wav),5);
  let peak=0;
  const sampled=new Set();
  for(let offset=44;offset<wav.length;offset+=80){
    const sample=wav.readInt16LE(offset);
    peak=Math.max(peak,Math.abs(sample));
    sampled.add(sample);
  }
  assert.ok(peak>500,"music bed should not be silent");
  assert.ok(sampled.size>100,"music bed should contain a changing signal, not a flat DC offset");
});

test("transition sound design is synchronized, localized and deterministic",()=>{
  const dry=createProceduralBedWav(5,"scientific-2-5d");
  const cued=createProceduralBedWav(5,"scientific-2-5d",[
    {time:2.5,type:"wipe"},
    {time:4,type:"scale"}
  ]);
  assert.equal(cued.length,dry.length);
  const rate=24000,bytesPerFrame=4;
  const quietStart=44+Math.floor(0.55*rate)*bytesPerFrame;
  const quietEnd=44+Math.floor(1.05*rate)*bytesPerFrame;
  assert.equal(Buffer.compare(cued.subarray(quietStart,quietEnd),dry.subarray(quietStart,quietEnd)),0);
  const cueStart=44+Math.floor(2.15*rate)*bytesPerFrame;
  const cueEnd=44+Math.floor(2.72*rate)*bytesPerFrame;
  let absoluteDifference=0;
  let samples=0;
  for(let offset=cueStart;offset<cueEnd;offset+=4){
    absoluteDifference+=Math.abs(cued.readInt16LE(offset)-dry.readInt16LE(offset));
    samples++;
  }
  assert.ok(absoluteDifference/samples>20,"a transition cue should add a measurable, local sound effect");
  assert.equal(Buffer.compare(cued,createProceduralBedWav(5,"scientific-2-5d",[
    {time:2.5,type:"wipe"},{time:4,type:"scale"}
  ])),0,"the procedural soundtrack should be reproducible");
});

test("QC samples interior frames rather than exact start and midpoint cuts",()=>{
  assert.deepEqual(sampleTimes(12),[0.96,6.96,11.52]);
  for(const duration of [5,12,90]){
    const times=sampleTimes(duration);
    assert.equal(times.length,3);
    assert.equal(new Set(times).size,3);
    assert.ok(times.every(t=>t>0&&t<duration));
    assert.notEqual(times[0],duration/2);
    assert.notEqual(times[1],duration/2);
  }
  assert.deepEqual(sampleTimes(Number.NaN),[]);
});

test("WAV duration parser handles a minimal PCM header",()=>{
  const wav=Buffer.alloc(48);
  wav.write("RIFF",0);wav.writeUInt32LE(40,4);wav.write("WAVE",8);
  wav.writeUInt32LE(96000,28);wav.write("data",36);wav.writeUInt32LE(48000,40);
  assert.equal(wavDuration(wav),0.5);
  assert.equal(wavDuration(Buffer.from("not-wav")),null);
});

test("caption segmentation limits the visible caption and creates multiple cues", () => {
  const text = "A long spoken sentence should be broken into readable chunks instead of being shown all at once across a whole scene. This must work with Persian text too: هر جمله باید به بخش‌های کوتاه‌تر و خواناتر تقسیم شود.";
  const segments = splitCaptionSegments(text, 44);
  assert.ok(segments.length >= 3);
  for (const segment of segments) {
    const lines = segment.split("\n");
    assert.ok(lines.length <= 2);
    assert.ok(lines.every(line => line.length <= 44));
  }
});


test("kinetic title animation splits titles into words rather than one literal backslash-s sequence", async () => {
  const motion = await readFile(new URL("../src/production/MotionVideo.tsx", import.meta.url), "utf8");
  assert.ok(
    motion.includes('scene.title.trim().split(/\\s+/)'),
    "title words must be split on whitespace so each word can animate independently"
  );
});

test("caption segmentation wraps exceptionally long unbroken tokens without overflowing mobile lines", () => {
  const segments = splitCaptionSegments("X".repeat(100), 44);
  assert.ok(segments.length >= 2, "long tokens must be split into readable chunks");
  for (const segment of segments) {
    for (const line of segment.split("\n")) {
      assert.ok(Array.from(line).length <= 44, "no caption line may exceed the configured character limit");
    }
  }
});


test("production CLI supports long-form runtimes beyond ten minutes up to one hour",()=>{
  assert.equal(parseArgs(["--duration","601"],{}).duration,601);
  assert.equal(parseArgs(["--duration","3600"],{}).duration,3600);
  assert.throws(()=>parseArgs(["--duration","3601"],{}),/5 and 3600 seconds/);
  const plan=buildLocalPlan({topic:"Long-form story",language:"en",styleId:"cinematic-documentary",totalFrames:601*30,fps:30});
  assert.equal(plan.scenes.reduce((sum,scene)=>sum+scene.durationInFrames,0),601*30);
});
