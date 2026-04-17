-- ============================================================
-- PsychFlo Burnout Early Warning — Supabase Schema
-- Run this in your Supabase SQL editor after creating a project
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Users / Employees ─────────────────────────────────────
create table if not exists employees (
  id              uuid primary key default gen_random_uuid(),
  auth_user_id    uuid unique references auth.users(id) on delete cascade,
  email           text unique not null,
  org_id          uuid,
  team_id         uuid,
  role            text check (role in ('employee', 'manager', 'hr', 'admin')) default 'employee',
  consent_given   boolean default false,
  consent_date    timestamptz,
  created_at      timestamptz default now()
);

-- ─── Organisations ─────────────────────────────────────────
create table if not exists organisations (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  stripe_customer_id text,
  plan            text check (plan in ('free', 'team', 'enterprise')) default 'free',
  created_at      timestamptz default now()
);

-- ─── Teams ─────────────────────────────────────────────────
create table if not exists teams (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid references organisations(id) on delete cascade,
  name            text not null,
  manager_id      uuid references employees(id),
  created_at      timestamptz default now()
);

-- Add FKs back to employees
alter table employees
  add foreign key (org_id)  references organisations(id),
  add foreign key (team_id) references teams(id);

-- ─── Weekly Check-ins ──────────────────────────────────────
create table if not exists burnout_checkins (
  id                uuid primary key default gen_random_uuid(),
  employee_id       uuid references employees(id) on delete cascade,
  week_number       int not null,
  week_start        date default date_trunc('week', now()),
  burnout_score     int not null check (burnout_score between 0 and 100),
  exhaustion_score  int not null check (exhaustion_score between 0 and 100),
  cynicism_score    int not null check (cynicism_score between 0 and 100),
  efficacy_score    int not null check (efficacy_score between 0 and 100),
  stressors         text[],
  raw_responses     jsonb,
  consent_given     boolean not null default true,
  created_at        timestamptz default now(),
  -- One check-in per employee per week
  unique (employee_id, week_start)
);

-- Index for trend queries
create index if not exists checkins_employee_week
  on burnout_checkins (employee_id, week_number);

-- ─── Team Aggregations (pre-computed, refreshed weekly) ────
create table if not exists team_snapshots (
  id                uuid primary key default gen_random_uuid(),
  team_id           uuid references teams(id) on delete cascade,
  week_start        date not null,
  avg_burnout       int,
  avg_exhaustion    int,
  avg_cynicism      int,
  avg_efficacy      int,
  count_high_risk   int,
  count_moderate    int,
  count_low_risk    int,
  response_count    int,
  top_stressors     jsonb,
  created_at        timestamptz default now(),
  unique (team_id, week_start)
);

-- ─── Scheduled Reminders ───────────────────────────────────
create table if not exists scheduled_reminders (
  id            uuid primary key default gen_random_uuid(),
  employee_id   uuid references employees(id) on delete cascade,
  send_day      text check (send_day in ('Mon','Tue','Wed','Thu','Fri')) default 'Mon',
  send_time     time default '09:00',
  channel       text check (channel in ('email', 'slack')) default 'email',
  active        boolean default true,
  last_sent_at  timestamptz,
  created_at    timestamptz default now()
);

-- ─── Invite Tokens ────────────────────────────────────────
create table if not exists invite_tokens (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  org_id      uuid references organisations(id) on delete cascade,
  used        boolean default false,
  expires_at  timestamptz not null,
  created_at  timestamptz default now()
);

-- ─── Stripe Subscriptions ─────────────────────────────────
alter table organisations
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text default 'inactive',
  add column if not exists sector text,
  add column if not exists size text;

-- ─── Data Deletion Requests (GDPR) ────────────────────────
create table if not exists deletion_requests (
  id              uuid primary key default gen_random_uuid(),
  employee_id     uuid references employees(id),
  requested_at    timestamptz default now(),
  completed_at    timestamptz,
  status          text check (status in ('pending', 'completed')) default 'pending'
);

-- ─── Row Level Security ────────────────────────────────────
alter table employees         enable row level security;
alter table burnout_checkins  enable row level security;
alter table team_snapshots    enable row level security;
alter table scheduled_reminders enable row level security;

-- Employees can only read/write their own data
create policy "employees_own_data" on employees
  for all using (auth.uid() = auth_user_id);

create policy "checkins_own_data" on burnout_checkins
  for all using (
    employee_id = (select id from employees where auth_user_id = auth.uid())
  );

-- Managers can read their team's snapshots (anonymised)
create policy "managers_read_team_snapshots" on team_snapshots
  for select using (
    team_id in (
      select id from teams where manager_id = (
        select id from employees where auth_user_id = auth.uid()
      )
    )
  );

-- ─── Anonymised Team View for Managers ────────────────────
-- Managers see risk buckets, never individual scores
create or replace view team_risk_summary as
select
  t.id as team_id,
  t.name as team_name,
  count(*) filter (where c.burnout_score >= 67) as high_risk,
  count(*) filter (where c.burnout_score between 34 and 66) as moderate_risk,
  count(*) filter (where c.burnout_score < 34) as low_risk,
  round(avg(c.burnout_score)) as avg_score,
  round(avg(c.exhaustion_score)) as avg_exhaustion,
  round(avg(c.cynicism_score)) as avg_cynicism,
  round(avg(c.efficacy_score)) as avg_efficacy,
  count(*) as total_responses,
  date_trunc('week', c.created_at) as week_start
from teams t
join employees e on e.team_id = t.id
join burnout_checkins c on c.employee_id = e.id
-- Suppress results with fewer than 5 responses to protect anonymity
group by t.id, t.name, date_trunc('week', c.created_at)
having count(*) >= 5;
