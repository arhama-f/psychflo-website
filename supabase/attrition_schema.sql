-- Attrition risk scores — one row per scoring run per employee
create table if not exists attrition_scores (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  org_id uuid references organisations(id) on delete cascade,
  risk_score integer check (risk_score between 0 and 100),
  risk_level text check (risk_level in ('low', 'medium', 'high', 'critical')) default 'low',
  drivers jsonb default '[]',               -- top 3 signal drivers as string array
  recommendation text,                       -- manager action
  predicted_departure_days integer,          -- 30 | 60 | 90 | null
  signals_snapshot jsonb default '{}',       -- raw signals used in this scoring run
  created_at timestamptz default now()
);

create index if not exists attrition_scores_employee_id_idx on attrition_scores(employee_id);
create index if not exists attrition_scores_org_id_idx on attrition_scores(org_id);
create index if not exists attrition_scores_created_at_idx on attrition_scores(created_at desc);

-- Assessment logs — stores every tool result per employee for signal aggregation
create table if not exists assessment_logs (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  org_id uuid references organisations(id) on delete cascade,
  tool text not null,                        -- 'standup' | 'cogload' | 'burnout' | 'onboarding'
  score integer,                             -- normalised 0-100
  flags jsonb default '[]',
  raw_output jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists assessment_logs_employee_id_idx on assessment_logs(employee_id);
create index if not exists assessment_logs_org_id_tool_idx on assessment_logs(org_id, tool);
create index if not exists assessment_logs_created_at_idx on assessment_logs(created_at desc);

-- RLS: employees can read their own; admins/managers can read org-wide
alter table attrition_scores enable row level security;
alter table assessment_logs enable row level security;

create policy "org members read attrition scores"
  on attrition_scores for select
  using (org_id in (select org_id from employees where auth_user_id = auth.uid()));

create policy "org admins insert attrition scores"
  on attrition_scores for insert
  with check (org_id in (select org_id from employees where auth_user_id = auth.uid() and role in ('admin', 'manager')));

create policy "org members read assessment logs"
  on assessment_logs for select
  using (org_id in (select org_id from employees where auth_user_id = auth.uid()));

create policy "employees insert own assessment logs"
  on assessment_logs for insert
  with check (employee_id in (select id from employees where auth_user_id = auth.uid()));
