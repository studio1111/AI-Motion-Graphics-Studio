# AI Motion Graphics Studio

A curated, safety-reviewed toolkit for AI-assisted motion design and programmatic video production.

## Goals
- Create repeatable motion graphics, product promos, explainers, kinetic typography, logo reveals, and animated infographics.
- Keep agent instructions separate from actual rendering tools.
- Prefer official upstream skill repositories and document source, license, prerequisites, and tested setup for every imported skill.
- Avoid copying third-party material without checking its license and preserve attribution.

## Skill catalogue

| Area | Planned integration | Status |
|---|---|---|
| Programmatic video | Official Remotion agent skills | To verify/import |
| Web animation | GSAP documentation and carefully scoped agent guidance | To verify/import |
| HTML/CSS motion scenes | HyperFrames | To verify/import |
| Motion design principles | Curated local guidance | Planned |
| Kinetic typography | Remotion/GSAP workflows | Planned |
| Cinematography | Curated prompt and shot-planning guidance | Planned |
| 3D motion | Blender / Three.js workflow guidance | Planned |
| Animated infographics | Remotion chart and data-visualization workflows | Planned |
| Captions and subtitles | Remotion caption workflow | Planned |

A tool/framework is not automatically an Agent Skill. Only directories with valid `SKILL.md` instructions are treated as skills by compatible agents.

## Compatibility
Skills are stored under `.agents/skills/` where practical. The consuming agent must support Agent Skills or be configured to read this directory. Runtime dependencies such as Node.js, Remotion, FFmpeg, Blender, and browser tooling are separate from the skill instructions.

## Safety and quality checks
1. Inspect upstream source and license before importing.
2. Do not run install scripts or downloaded code blindly.
3. Pin versions when practical and document system requirements.
4. Test a minimal render before declaring a workflow working.
5. Do not commit API keys, tokens, credentials, generated media, or large binaries.

## Status
Repository initialization. Integrations are not considered complete until their upstream source, license, dependencies, and basic test are recorded.
