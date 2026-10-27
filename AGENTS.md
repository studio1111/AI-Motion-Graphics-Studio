# Agent instructions

## Mission
Build a dependable AI-assisted motion-graphics toolkit for reproducible video creation.

## Working rules
- Inspect related files and upstream documentation before changing anything.
- Prefer the smallest correct change; reuse existing tools and avoid unnecessary dependencies.
- Preserve security, accessibility, validation, error handling, reproducibility, and meaningful tests.
- Never claim a skill or rendering workflow is installed, compatible, or tested unless the repository contains it and the relevant checks have actually passed.
- Distinguish Agent Skills (instruction directories containing SKILL.md) from frameworks, CLIs, plugins, and services.
- Before importing a third-party skill, verify its canonical source, current contents, license/redistribution terms, prerequisites, and installation method. Keep attribution and upstream links.
- Do not copy third-party code or documentation wholesale unless its license permits redistribution. Prefer small local adapters or documented installation steps when licensing is unclear.
- Do not execute downloaded scripts automatically. Inspect scripts and dependency changes first.
- Do not commit secrets, tokens, credentials, private media, or generated render files.
- Test a minimal example/render when practical; report exact checks and failures honestly.
- Keep documentation in sync with actual files and supported environments.

## Repository conventions
- Put portable Agent Skills in `.agents/skills/<skill-name>/SKILL.md`.
- Each skill should state when to use it, workflow, prerequisites, constraints, examples, source URL, and license/status.
- Keep tool-specific setup notes separate where agent compatibility differs.
- Use descriptive commits and avoid unrelated changes.
