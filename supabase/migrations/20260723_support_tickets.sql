-- In-house Support Ticket system (Frank -> Drew work request loop)
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ref_number serial,
  title text not null,
  description text,
  category text not null default 'front_end'
    check (category in ('front_end','back_end','mobile_app','other')),
  priority text not null default 'normal'
    check (priority in ('low','normal','high','urgent')),
  status text not null default 'new'
    check (status in ('new','in_progress','review','verified_complete','reopened')),
  submitted_by text not null default 'Frank',
  assigned_to text not null default 'Drew',
  due_date date,
  completed_at timestamptz,
  verified_at timestamptz,
  -- Agent loop fields (Phase 3 - reserved now so no second migration later)
  agent_status text not null default 'not_started'
    check (agent_status in ('not_started','working','hitl_needed','dev_ready')),
  agent_notes text,
  hitl_reason text,
  dev_preview_url text,
  promoted_to_live_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_activity (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  actor text not null default 'System',
  action text not null,
  old_value text,
  new_value text,
  note text,
  attachment_url text,
  created_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;
alter table public.ticket_activity enable row level security;

create or replace function public.handle_ticket_update() returns trigger as $$
begin
  new.updated_at = now();
  if new.status <> old.status then
    if new.status = 'verified_complete' then
      new.verified_at = now();
      new.completed_at = coalesce(new.completed_at, now());
    end if;
    insert into public.ticket_activity(ticket_id, actor, action, old_value, new_value)
    values (new.id, coalesce(new.assigned_to,'System'), 'status_change', old.status, new.status);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_ticket_update before update on public.support_tickets
  for each row execute function public.handle_ticket_update();

create or replace function public.handle_ticket_insert() returns trigger as $$
begin
  insert into public.ticket_activity(ticket_id, actor, action, new_value)
  values (new.id, new.submitted_by, 'created', new.status);
  return new;
end;
$$ language plpgsql;

create trigger trg_ticket_insert after insert on public.support_tickets
  for each row execute function public.handle_ticket_insert();
