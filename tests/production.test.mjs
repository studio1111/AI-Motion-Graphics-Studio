import test from "node:test";
import assert from "node:assert/strict";
import { allocateFrames, buildLocalPlan, chooseStyle, createProceduralBedWav, normalizePlan, parseArgs, parsePeakVolumeDb, safeSlug, sampleTimes, splitCaptionSegments, validateStoryboard, wavDuration } from "../scripts/produce.mjs";

test("local fallback creates eight scenes and varies visual layouts",()=>{
  const plan=buildLocalPlan({topic:"دگرگونی اقلیم",language:"fa",styleId:"scientific-2-5d",totalFrames:2700,fps:30});
  assert.equal(plan.scenes.length,8);
  assert.equal(plan.contentMode,"conceptual_template");
  assert.ok(plan.scenes[0].title.includes("دگرگونی اقلیم"));
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
