#!/usr/bin/env node
// Single source of truth: docs/engineering/state/release-state.yaml.
//
// docs/engineering/AI-RELEASE-STATE.md and docs/AI-HANDOFF.md's status block
// are GENERATED from that YAML file and must never be hand-edited directly.
// This keeps exactly one writable state authority while every existing CI
// consumer (merge-gate.yml, persona-qa.yml, hosted-qa.yml,
// scripts/update-ai-ops-status.sh) keeps reading the generated Markdown
// unchanged -- migrating those workflows' grep/sed parsing to read YAML
// directly was considered and deliberately not done in this pass: it is a
// materially higher-risk change (four workflows, including a literal
// `^CURRENT_CHECKPOINT: Issue #5` string match in hosted-qa.yml) for no
// additional safety benefit, since a generated, drift-checked file is not a
// second independent authority.
//
// Usage:
//   node scripts/release-state.mjs validate   # schema-check the YAML only
//   node scripts/release-state.mjs generate   # regenerate both Markdown files
//   node scripts/release-state.mjs check      # fail if generated output would differ from what's on disk

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const yamlPath = path.join(repoRoot, "docs/engineering/state/release-state.yaml");
const schemaPath = path.join(repoRoot, "docs/engineering/state/release-state.schema.json");
const releaseStateMdPath = path.join(repoRoot, "docs/engineering/AI-RELEASE-STATE.md");
const handoffMdPath = path.join(repoRoot, "docs/AI-HANDOFF.md");

const FIELD_ORDER = [
  "STATUS",
  "CURRENT_PHASE",
  "CURRENT_CHECKPOINT",
  "NEXT_CHECKPOINT",
  "OWNER_DECISION_REQUIRED",
  "SAFE_TO_CONTINUE",
  "ACCEPTED_CODE_SHA",
  "ACCEPTANCE_RUNTIME",
  "ACCEPTANCE_DEPLOYED_SHA",
];

function loadState() {
  const raw = readFileSync(yamlPath, "utf8");
  const data = yaml.load(raw);
  if (!data || typeof data !== "object") {
    throw new Error(`Failed to parse ${yamlPath} as a YAML mapping`);
  }
  return data;
}

function loadSchema() {
  return JSON.parse(readFileSync(schemaPath, "utf8"));
}

// Minimal, dependency-free validator for the narrow subset of JSON Schema
// this file actually uses (required/type/enum/minLength/pattern on a single
// flat string-valued object). Not a general-purpose JSON Schema engine --
// adding a real one (ajv) for nine flat string fields would be a heavier
// dependency than the problem warrants.
function validate(data, schema) {
  const errors = [];

  for (const required of schema.required ?? []) {
    if (!(required in data)) {
      errors.push(`missing required field: ${required}`);
    }
  }

  if (schema.additionalProperties === false) {
    for (const key of Object.keys(data)) {
      if (!(key in (schema.properties ?? {}))) {
        errors.push(`unexpected field not in schema: ${key}`);
      }
    }
  }

  for (const [key, value] of Object.entries(data)) {
    const propSchema = schema.properties?.[key];
    if (!propSchema) continue;
    if (propSchema.type === "string" && typeof value !== "string") {
      errors.push(`${key} must be a string, got ${typeof value}`);
      continue;
    }
    if (propSchema.enum && !propSchema.enum.includes(value)) {
      errors.push(`${key}=${JSON.stringify(value)} is not one of ${JSON.stringify(propSchema.enum)}`);
    }
    if (propSchema.minLength && String(value).length < propSchema.minLength) {
      errors.push(`${key} must be at least ${propSchema.minLength} character(s)`);
    }
    if (propSchema.pattern && !new RegExp(propSchema.pattern).test(String(value))) {
      errors.push(`${key}=${JSON.stringify(value)} does not match pattern ${propSchema.pattern}`);
    }
  }

  return errors;
}

function fieldBlock(data) {
  return FIELD_ORDER.map((key) => `${key}: ${data[key]}`).join("\n");
}

function renderReleaseStateMd(data) {
  return `# AI Release State

This is the canonical machine-readable release-state contract for repository
automation. It is intentionally compact. Human live status, blockers, and next
actions belong in [\`../AI-CONTROLLER.md\`](../AI-CONTROLLER.md).

<!-- GENERATED FILE -- do not hand-edit. Source of truth is
     docs/engineering/state/release-state.yaml. Regenerate with
     \`node scripts/release-state.mjs generate\`. -->

${fieldBlock(data)}

## Contract

The required top-level fields are \`STATUS\`, \`CURRENT_PHASE\`,
\`CURRENT_CHECKPOINT\`, \`NEXT_CHECKPOINT\`, \`OWNER_DECISION_REQUIRED\`,
\`SAFE_TO_CONTINUE\`, and \`ACCEPTED_CODE_SHA\`. Workflows and
\`scripts/update-ai-ops-status.sh\` parse this path directly.

\`docs/AI-HANDOFF.md\` remains a field-compatible legacy adapter for inbound
links and integrations. Its status block is generated from the same source
(\`docs/engineering/state/release-state.yaml\`) and kept synchronized
automatically; it is not independently hand-edited.
`;
}

function updateHandoffMd(data) {
  const original = readFileSync(handoffMdPath, "utf8");
  const blockPattern =
    /STATUS: .*\nCURRENT_PHASE: .*\nCURRENT_CHECKPOINT: .*\nNEXT_CHECKPOINT: .*\nOWNER_DECISION_REQUIRED: .*\nSAFE_TO_CONTINUE: .*\nACCEPTED_CODE_SHA: .*\nACCEPTANCE_RUNTIME: .*\nACCEPTANCE_DEPLOYED_SHA: .*/;
  if (!blockPattern.test(original)) {
    throw new Error(
      `Could not find the expected 9-field state block in ${handoffMdPath}; refusing to write a partial update.`,
    );
  }
  return original.replace(blockPattern, fieldBlock(data));
}

function main() {
  const command = process.argv[2];
  const data = loadState();
  const schema = loadSchema();
  const errors = validate(data, schema);

  if (errors.length > 0) {
    console.error(`${yamlPath} failed schema validation:`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  if (command === "validate") {
    console.log("release-state.yaml is valid.");
    return;
  }

  if (command === "generate") {
    writeFileSync(releaseStateMdPath, renderReleaseStateMd(data));
    writeFileSync(handoffMdPath, updateHandoffMd(data));
    console.log(
      `Regenerated ${path.relative(repoRoot, releaseStateMdPath)} and ${path.relative(repoRoot, handoffMdPath)} from release-state.yaml.`,
    );
    return;
  }

  if (command === "check") {
    const expectedReleaseState = renderReleaseStateMd(data);
    const actualReleaseState = readFileSync(releaseStateMdPath, "utf8");
    const expectedHandoff = updateHandoffMd(data);
    const actualHandoff = readFileSync(handoffMdPath, "utf8");

    let drift = false;
    if (expectedReleaseState !== actualReleaseState) {
      console.error(
        `${path.relative(repoRoot, releaseStateMdPath)} is out of sync with release-state.yaml -- run 'node scripts/release-state.mjs generate'.`,
      );
      drift = true;
    }
    if (expectedHandoff !== actualHandoff) {
      console.error(
        `${path.relative(repoRoot, handoffMdPath)}'s state block is out of sync with release-state.yaml -- run 'node scripts/release-state.mjs generate'.`,
      );
      drift = true;
    }
    if (drift) process.exit(1);
    console.log("Generated release-state Markdown files are in sync with release-state.yaml.");
    return;
  }

  console.error("usage: node scripts/release-state.mjs <validate|generate|check>");
  process.exit(2);
}

main();
