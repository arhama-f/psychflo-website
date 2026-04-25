-- ============================================================
-- PsychFlo Burnout Early Warning — Supabase Schema
-- Run this in your Supabase SQL editor after creating a project
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Organisations ─────────────────────────────────────────
create table if not exists organisations (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  subscription_status     text default 'inactive',
  plan                    text check (plan in ('free', 'team', 'enterprise')) default 'free',
  sector                  text,
  size                    text,
  created_at              timestamptz default now()
);

-- ─── Teams ─────────────────────────────────────────────────
create table if not exists teams (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid references organisations(id) on delete cascade,
  name        text not null,
  manager_id  uuid,  -- FK added after employees table
  created_at  timestamptz default now()
);

-- ─── Users / Employees ─────────────────────────────────────
create table if not exists employees (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique references auth.users(id) on delete cascade,
  email         text unique not null,
  name          text,
  org_id        uuid references organisations(id),
  team_id       uuid references teams(id),
  role          text check (role in ('employee', 'manager', 'hr', 'admin')) default 'employee',
  consent_given boolean default false,
  consent_date  timestamptz,
  created_at    timestamptz default now()
);

-- Add manager FK back to teams
alter table teams
  add foreign key (manager_id) references employees(id);

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
  unique (employee_id, week_start)
);

create index if not exists checkins_employee_week
  on burnout_checkins (employee_id, week_number);

-- ─── Team Aggregations ─────────────────────────────────────
create table if not exists team_snapshots (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid references teams(id) on delete cascade,
  week_start      date not null,
  avg_burnout     int,
  avg_exhaustion  int,
  avg_cynicism    int,
  avg_efficacy    int,
  count_high_risk int,
  count_moderate  int,
  count_low_risk  int,
  response_count  int,
  top_stressors   jsonb,
  created_at      timestamptz default now(),
  unique (team_id, week_start)
);

-- ─── Scheduled Reminders ───────────────────────────────────
create table if not exists scheduled_reminders (
  id           uuid primary key default gen_random_uuid(),
  employee_id  uuid unique references employees(id) on delete cascade,
  send_day     text check (send_day in ('Mon','Tue','Wed','Thu','Fri')) default 'Mon',
  send_time    time default '09:00',
  channel      text check (channel in ('email', 'slack')) default 'email',
  active       boolean default true,
  last_sent_at timestamptz,
  created_at   timestamptz default now()
);

-- ─── Manager Conversation Scripts Log ─────────────────────
create table if not exists manager_scripts (
  id            uuid primary key default gen_random_uuid(),
  employee_id   uuid references employees(id) on delete cascade,
  generated_at  timestamptz default now(),
  risk_level    text check (risk_level in ('high', 'moderate', 'low')),
  burnout_score int
);

-- ─── Invite Tokens ─────────────────────────────────────────
create table if not exists invite_tokens (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  org_id     uuid references organisations(id) on delete cascade,
  used       boolean default false,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- ─── Burnout Alerts Log ───────────────────────────────────
create table if not exists burnout_alerts (
  id                uuid primary key default gen_random_uuid(),
  employee_id       uuid references employees(id) on delete cascade,
  burnout_score     int not null,
  alert_type        text default 'high_risk',
  manager_notified  boolean default false,
  created_at        timestamptz default now()
);

-- ─── HRIS Connections ─────────────────────────────────────
create table if not exists hris_connections (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid references organisations(id) on delete cascade,
  provider      text check (provider in ('bamboohr', 'hibob', 'personio', 'workday', 'csv')) not null,
  api_key       text,
  subdomain     text,
  client_id     text,
  client_secret text,
  status        text check (status in ('connected', 'error', 'syncing')) default 'connected',
  last_synced_at timestamptz,
  employee_count int default 0,
  created_at    timestamptz default now(),
  unique (org_id, provider)
);

alter table hris_connections enable row level security;

create policy "hris_org_access" on hris_connections
  for all using (
    org_id in (select org_id from employees where auth_user_id = auth.uid())
  );

-- ─── Data Deletion Requests (GDPR) ────────────────────────
create table if not exists deletion_requests (
  id           uuid primary key default gen_random_uuid(),
  employee_id  uuid references employees(id),
  requested_at timestamptz default now(),
  completed_at timestamptz,
  status       text check (status in ('pending', 'completed')) default 'pending'
);

-- ─── Row Level Security ────────────────────────────────────
alter table employees           enable row level security;
alter table organisations       enable row level security;
alter table teams               enable row level security;
alter table burnout_checkins    enable row level security;
alter table team_snapshots      enable row level security;
alter table scheduled_reminders enable row level security;
alter table invite_tokens       enable row level security;
alter table burnout_alerts      enable row level security;
alter table manager_scripts     enable row level security;
alter table deletion_requests   enable row level security;

-- employees: read/write own row only
create policy "employees_own_data" on employees
  for all using (auth.uid() = auth_user_id);

-- organisations: members of the org can read; service role writes
create policy "org_members_read" on organisations
  for select using (
    id in (select org_id from employees where auth_user_id = auth.uid())
  );

-- teams: members of the org can read their teams
create policy "team_members_read" on teams
  for select using (
    org_id in (select org_id from employees where auth_user_id = auth.uid())
  );

-- burnout_checkins: employees read/write their own check-ins
create policy "checkins_own_data" on burnout_checkins
  for all using (
    employee_id = (select id from employees where auth_user_id = auth.uid())
  );

-- team_snapshots: managers read snapshots for teams they manage
create policy "managers_read_team_snapshots" on team_snapshots
  for select using (
    team_id in (
      select id from teams where manager_id = (
        select id from employees where auth_user_id = auth.uid()
      )
    )
  );

-- scheduled_reminders: employees manage their own reminders
create policy "reminders_own_data" on scheduled_reminders
  for all using (
    employee_id = (select id from employees where auth_user_id = auth.uid())
  );

-- invite_tokens: org admins/managers can read invites for their org
create policy "invite_tokens_org_read" on invite_tokens
  for select using (
    org_id in (select org_id from employees where auth_user_id = auth.uid())
  );

-- burnout_alerts: employees can read their own alerts
create policy "burnout_alerts_own" on burnout_alerts
  for all using (
    employee_id = (select id from employees where auth_user_id = auth.uid())
  );

-- manager_scripts: managers can read scripts they generated
create policy "manager_scripts_own" on manager_scripts
  for all using (
    employee_id = (select id from employees where auth_user_id = auth.uid())
  );

-- deletion_requests: employees can create and read their own requests
create policy "deletion_requests_own" on deletion_requests
  for all using (
    employee_id = (select id from employees where auth_user_id = auth.uid())
  );

-- ─── Anonymised Team View for Managers ────────────────────
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
group by t.id, t.name, date_trunc('week', c.created_at)
having count(*) >= 5;
