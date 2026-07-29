-- Allow tickets to be created as "pending" — logged but not yet ready to
-- start (no due date required, distinct from "new" which implies ready to
-- start work).
alter table public.support_tickets
  drop constraint if exists support_tickets_status_check;

alter table public.support_tickets
  add constraint support_tickets_status_check
  check (status in ('pending','new','in_progress','review','verified_complete','reopened'));
