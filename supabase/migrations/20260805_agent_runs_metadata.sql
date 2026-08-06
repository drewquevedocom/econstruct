-- agent_runs.metadata was read by daily-report.ts (and, as of Phase 1, relied
-- on by partner-enroll's fail-closed verification halt) but completeAgentRun()
-- in src/lib/agents/runner.ts never actually wrote it -- every run's metadata
-- was silently discarded, so every read of it always came back null. Fixed in
-- code; this guarantees the column exists so that fix actually works. Safe to
-- run whether or not the column is already present.
ALTER TABLE agent_runs
  ADD COLUMN IF NOT EXISTS metadata jsonb;
