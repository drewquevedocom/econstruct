-- Soft-delete archive for support tickets. Archived tickets are never
-- actually deleted -- just hidden from the default list view and
-- excluded from the open/overdue/review stat counts.
alter table public.support_tickets
  add column if not exists archived_at timestamptz;
