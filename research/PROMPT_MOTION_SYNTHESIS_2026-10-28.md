# Prompt Motion Research Synthesis: 2026-10-28

## Scope and evidence

This synthesis is based on public Prompt Motion article pages, template pages and selected example pages, plus the project's existing reference catalog. It is not a claim that every video in the gallery was watched. The repository's 21 Prompt Motion example entries are recorded as L1 source-page reviews; one separate sampled video spot-check remains explicitly sampled and is not a continuous full watch or L3 timestamped breakdown.

Sources reviewed:
- [AI motion graphics prompts: what 230 real examples show](https://prompt-motion.com/blog/ai-motion-graphics-prompts), published October 10, 2026.
- [How to prompt an AI launch video: lessons from 92 real prompts](https://prompt-motion.com/blog/ai-launch-video-prompts), published October 10, 2026.
- [Why AI motion graphics look AI-made, and the prompt lines that fix it](https://prompt-motion.com/blog/make-ai-motion-graphics-look-less-ai).
- [The rewritten showreel prompt](https://prompt-motion.com/templates/showreel).
- [Shape morphing through UI states](https://prompt-motion.com/twoclipping-5cba86).
- [The source gallery](https://prompt-motion.com/).

## Reported source-study observations

The Prompt Motion article reports 233 entries from 216 creators between September 23 and October 8, 2026, 230 entries with prompts, and Claude Opus 5.5 as the named model for that sample. It reports a median prompt length of 26 words, with the middle half between 18 and 36 words, 94 launch videos, 78 showreels, and 27 explainers. In that source sample, 19 prompts over 100 words had a median of 56 likes compared with 5 for prompts of 26 words or fewer. The article cautions that the sample is small and audience size/creator experience are confounders. These figures are descriptive signals from the cited gallery sample, not causal proof or a universal scoring rule.

The launch-video article reports that it examined 92 launch prompts and notes that stronger prompts specify what to show and how to explain product value rather than requesting polish alone. The rewritten showreel prompt responds to a broad one-line brief by specifying a single named concept, continuous transformations, a constrained type and color system, a consistent camera language, beat-structured escalation, anti-patterns and a final-frame loop. The shape-morph example goes deeper technically: one object morphs through meaningful UI states; timing is deterministic; sounds are placed using measured peaks; motion blur is rendered through subframes; and frames are inspected before the full export.

## What the studio should adopt

1. **Specificity should remove decisions.** Include actual audience, subject, concept, state list, motion path, transitions, typography, palette, sound, timing and acceptance checks. Adding adjectives without resolving a decision is not progress.
2. **One visual thesis beats an unrelated effects reel.** Build every scene from the previous one using shared geometry, color, type or camera movement. Variety is valuable when the underlying film remains coherent.
3. **Timing is a system.** Use a beat grid when music-led, speech-aware holds when narration-led, and explicit duration constraints in all cases. Do not force every project to 120 BPM.
4. **A build method matters.** For code-based rendering, use deterministic time functions, measured audio features and key-frame sampling. For generated-video workflows, establish shot continuity, references, subject consistency and repair strategy.
5. **Banned lists are useful only when targeted.** Prevent recurring failure modes that harm this brief, such as random glow/particles, camera shake, arbitrary crossfades or unreadable text. Do not mechanically ban a technique the concept actually needs.
6. **Review is part of the prompt.** Require a beat sheet, storyboard, frame sample, defect report and repair loop before a render can be called final.
7. **Popularity is not correctness.** Likes and prompt length cannot substitute for factual, visual, technical or accessibility checks.
8. **Product films need real product truth.** Name the user problem, important feature, correct UI states, substantiated benefit, real assets and final CTA. A smooth motion system cannot compensate for invented product details.

## The original studio prompt pattern

Use this as an outline, not a copied source prompt:

- **Brief:** audience, objective, topic/product facts, runtime, language, format, brand and tool constraints.
- **Thesis:** one concise idea that every shot expresses.
- **Visual system:** main style recipe, font roles, palette, material, camera language and motif.
- **Story:** hook, setup, progressive reveal, payoff and end hold.
- **Timing:** timecoded scene durations, beat grid or voiceover-aware timing.
- **Motion:** cause-and-effect, path, easing, overlap, anticipation, settling and transition continuity.
- **Sound:** actual narration, music structure, measured transients, effects, ducking and final tail.
- **Build:** tool-specific implementation instructions and deterministic rendering constraints where applicable.
- **QA:** sampled frames, legibility, fact/source review, audio checks, technical metadata and targeted repairs.
- **Status:** distinguish concept, storyboard, rendered draft and verified final.

## Research limitations and next pass

The connected Firecrawl account and third-party video research calls returned insufficient-credit errors in this session. Public web search surfaced source page text and the project's previous sample-review notes, but that is not equivalent to continuous playback of the underlying videos. The next pass should prioritize directly accessible examples across kinetic type, data visualization, particles, characters, diagrams and music; capture start/middle/end and meaningful transition times; record audio only if it was actually heard; and promote a record to L3 only after a genuine timecoded breakdown.

No complete creator-authored prompt has been copied into the recipe JSON. The 70 recipes are original studio syntheses built from transferable principles. Keep source attribution, licence checks, and tool availability explicit.
