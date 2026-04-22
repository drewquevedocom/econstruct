import { readFileSync, writeFileSync } from "fs";

// Load campaign-templates.js and extract just the array literal.
const src = readFileSync("econstruct-crm/js/campaign-templates.js", "utf8");
const start = src.indexOf("const CRM_EMAIL_CAMPAIGNS = ");
if (start === -1) throw new Error("Could not find CRM_EMAIL_CAMPAIGNS");
const arrayStart = src.indexOf("[", start);
// Walk balanced brackets
let depth = 0;
let arrayEnd = -1;
for (let i = arrayStart; i < src.length; i++) {
  if (src[i] === "[") depth++;
  else if (src[i] === "]") {
    depth--;
    if (depth === 0) {
      arrayEnd = i + 1;
      break;
    }
  }
}
if (arrayEnd === -1) throw new Error("Could not find end of array");
const arrayText = src.slice(arrayStart, arrayEnd);
const campaigns = new Function("return " + arrayText)();

function esc(s) {
  return String(s ?? "").replace(/'/g, "''");
}

const lines = [];
lines.push("-- Auto-generated seed for email_sequences and sequence_steps");
lines.push("-- Source: econstruct-crm/js/campaign-templates.js");
lines.push("-- Generated: " + new Date().toISOString());
lines.push("");
lines.push("BEGIN;");
lines.push("");

for (const c of campaigns) {
  const seqVar = `seq_${c.title.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 30)}`;
  lines.push(`-- ${c.title}`);
  lines.push(`WITH ${seqVar} AS (`);
  lines.push(`  INSERT INTO email_sequences (name, description, is_active)`);
  lines.push(`  VALUES ('${esc(c.title)}', '${esc(c.summary)}', true)`);
  lines.push(`  ON CONFLICT DO NOTHING`);
  lines.push(`  RETURNING id`);
  lines.push(`)`);

  const steps = c.emails || [];
  if (!steps.length) {
    lines.push(`SELECT 1; -- no steps`);
    lines.push("");
    continue;
  }

  const valuesSql = steps.map((s) => {
    const subject = s.subjectA || s.subjectB || s.subjectC || "(no subject)";
    return `    (CAST((SELECT id FROM ${seqVar}) AS uuid), ${parseInt(s.sequence) || 0}, ${parseInt(s.day) || 0}, '${esc(subject)}', '${esc(s.body)}')`;
  }).join(",\n");

  lines.push(`INSERT INTO sequence_steps (sequence_id, step_number, delay_days, subject, body)`);
  lines.push(`VALUES`);
  lines.push(valuesSql);
  lines.push(`ON CONFLICT (sequence_id, step_number) DO NOTHING;`);
  lines.push("");
}

lines.push("COMMIT;");
lines.push("");

writeFileSync(
  "supabase/migrations/20260422_seed_email_sequences.sql",
  lines.join("\n"),
  "utf8"
);

console.log(`Generated seed for ${campaigns.length} campaigns.`);
for (const c of campaigns) {
  console.log(`  - ${c.title}: ${c.emails?.length || 0} steps`);
}
