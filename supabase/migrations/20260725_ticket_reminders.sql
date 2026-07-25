-- Support ticket overdue reminder digest (Phase 2)
alter table public.support_tickets
  add column if not exists last_reminder_sent_at timestamptz;
