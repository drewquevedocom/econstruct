-- Which property a ticket is for: inc = econstructinc.com, homes = econstructhomes.com,
-- crm = the CRM / mobile app itself. Nullable: tickets created before this column
-- stay unset and are labeled from the ticket page; the app requires it for new tickets.
alter table public.support_tickets
  add column if not exists website text
  check (website is null or website in ('inc','homes','crm'));
