#!/usr/bin/env node
// Future migrations must explicitly opt into Data API access after the
// October 2026 default privilege change. Do not mutate historical migrations.
import { readFileSync, readdirSync } from "node:fs";

const migrationDir = new URL("../supabase/migrations/", import.meta.url);
const legacyCutoff = "20261020120000";
let failures = 0;
for (const file of readdirSync(migrationDir)) {
  if (!file.endsWith(".sql") || file.slice(0, 14) <= legacyCutoff) continue;
  const sql = readFileSync(new URL(file, migrationDir), "utf8");
  const creates = [...sql.matchAll(/\bcreate\s+(?:unlogged\s+)?table\s+(?:if\s+not\s+exists\s+)?public\.([a-z_][a-z_0-9]*)\b/gi)];
  const grantStatements = [...sql.matchAll(/\bgrant\s+([\s\S]*?)\s+on\s+(?:table\s+)?([\s\S]*?)\s+to\s+(?:anon|authenticated|service_role)\s*;/gi)].map((m) => m[2]);
  for (const match of creates) {
    const table = match[1].toLowerCase();
    const explicitGrant = grantStatements.some((tables) => new RegExp(`\\bpublic\\.${table}\\b`, "i").test(tables));
    const explicitPrivate = new RegExp(`--\\s*data-api-private:\\s*public\\.${table}\\b`, "i").test(sql);
    if (!explicitGrant && !explicitPrivate) {
      console.error(`${file}: public.${table} has no explicit Data API grant or documented private exemption`);
      failures++;
    }
  }
}
if (failures) process.exitCode = 1;
else console.log("Public-table migration grants: PASS");
