#!/usr/bin/env node
import { runOpus55Command } from "../src/production/opus55-reference-library.mjs";

runOpus55Command().catch((error) => {
  process.stderr.write("Opus 5.5 reference library: " + String(error?.message || error) + "\n");
  process.exitCode = 1;
});
