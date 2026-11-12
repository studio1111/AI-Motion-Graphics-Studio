# Sokhan English-to-Persian evaluation

This is a **human-review fixture**, not a benchmark score and not a set of model-generated gold translations.

## Coverage

`en-fa-cases.json` contains ten English source cases covering:

- technical terminology and glossary consistency
- numbers and measurement units
- named entities and dates
- acronyms and machine-learning terminology
- idioms and non-literal meaning
- uncertainty and causal claims
- quotation and punctuation
- long, multi-clause narration
- mixed Latin/Persian script and API tokens
- instruction-like text that must remain source content

Reference translations are intentionally `null` and every case is `not_reviewed`. Do not fill them using the same model being evaluated and then call them human references.

## Review procedure

1. Generate a Sokhan translation draft for each source case.
2. Have a fluent Persian reviewer compare source and output.
3. Record a human-written reference translation only when the reviewer is satisfied.
4. Set `humanReviewStatus` to `reviewed` only after the review is complete.
5. Record the reviewer, date, notes and any glossary change in the evaluation report. Do not commit personal reviewer details unless they consent; an anonymized reviewer ID is sufficient.

Score each dimension from 1 to 5:

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| Semantic fidelity | Meaning substantially wrong | Main idea retained with notable nuance loss | Meaning, nuance and uncertainty preserved |
| Persian fluency | Unnatural or hard to understand | Understandable but needs editing | Natural contemporary Persian |
| Terminology | Inconsistent or incorrect | Mostly consistent | Exact glossary and domain terminology |
| Numbers and entities | Material corruption | Minor formatting issues | All values, names and units preserved |
| Narration suitability | Difficult to speak/listen to | Usable after edits | Clear cadence and punctuation for speech |

## Release gate

Do not approve the Persian release if any case has a critical meaning error, changed number/unit, lost negation, fabricated claim, altered entity, or instruction-following failure. Average scores cannot cancel a critical failure.

The fixture tests validate only coverage and honest review metadata. They do **not** prove translation quality. Real model evaluation and listening review remain **NOT RUN** until a Persian reviewer completes this process.
