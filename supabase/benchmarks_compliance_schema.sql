-- ─────────────────────────────────────────────
-- BENCHMARKING
-- ─────────────────────────────────────────────

-- Anonymised org-level snapshots contributed to the benchmark pool
create table if not exists benchmark_snapshots (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organisations(id) on delete cascade,
  industry text not null,                     -- 'saas' | 'finance' | 'healthcare' | 'legal' | 'retail' | 'tech' | 'other'
  headcount_band text not null,               -- '1-25' | '26-100' | '101-500' | '500+'
  safety_score integer,                       -- 0-100
  burnout_score integer,                      -- 0-100 (higher = more burnout)
  cogload_score integer,                      -- 0-100 (higher = higher load)
  attrition_risk integer,                     -- 0-100
  manager_effectiveness integer,              -- 0-100
  created_at timestamptz default now(),
  unique (org_id, date_trunc('month', created_at))
);

create index if not exists benchmark_snapshots_industry_idx on benchmark_snapshots(industry);
create index if not exists benchmark_snapshots_created_at_idx on benchmark_snapshots(created_at desc);

alter table benchmark_snapshots enable row level security;

-- Orgs can only read aggregated data (via API), not raw snapshots
create policy "orgs insert own snapshots"
  on benchmark_snapshots for insert
  with check (org_id in (select org_id from employees where auth_user_id = auth.uid() and role = 'admin'));

-- ─────────────────────────────────────────────
-- COMPLIANCE & AUDIT TRAIL
-- ─────────────────────────────────────────────

-- Every significant event logged for compliance evidence
create table if not exists compliance_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organisations(id) on delete cascade,
  employee_id uuid references employees(id) on delete set null,
  event_type text not null,                   -- see event types below
  event_data jsonb default '{}',              -- structured payload
  iso_clause text,                            -- e.g. '6.1.2' = risk assessment
  severity text check (severity in ('info', 'warning', 'action_required')) default 'info',
  actioned_by uuid references employees(id) on delete set null,
  actioned_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- event_type values:
--   assessment_completed  — employee completed a tool assessment
--   risk_flag_raised      — AI flagged a risk (burnout/attrition)
--   intervention_logged   — manager took action
--   policy_reviewed       — policy audit run
--   sso_login             — SSO authentication event
--   data_export           — GDPR data export requested
--   consent_given         — employee gave consent
--   consent_withdrawn     — employee withdrew consent

create index if not exists compliance_events_org_id_idx on compliance_events(org_id);
create index if not exists compliance_events_created_at_idx on compliance_events(created_at desc);
create index if not exists compliance_events_event_type_idx on compliance_events(event_type);

alter table compliance_events enable row level security;

create policy "org admins read compliance events"
  on compliance_events for select
  using (org_id in (select org_id from employees where auth_user_id = auth.uid() and role in ('admin', 'manager')));

create policy "system insert compliance events"
  on compliance_events for insert
  with check (org_id in (select org_id from employees where auth_user_id = auth.uid()));

-- ─────────────────────────────────────────────
-- DAILY PULSE (Employee PWA)
-- ─────────────────────────────────────────────

create table if not exists pulse_checkins (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  org_id uuid references organisations(id) on delete cascade,
  mood integer check (mood between 1 and 5),               -- 1=struggling, 5=thriving
  energy integer check (energy between 1 and 5),
  workload integer check (workload between 1 and 5),       -- 1=manageable, 5=overwhelming
  connection integer check (connection between 1 and 5),   -- 1=isolated, 5=connected
  note text,                                               -- optional free text
  ai_coaching text,                                        -- AI micro-coaching response
  streak integer default 1,                                -- consecutive day streak
  created_at timestamptz default now()
);

create index if not exists pulse_checkins_employee_id_idx on pulse_checkins(employee_id);
create index if not exists pulse_checkins_org_id_idx on pulse_checkins(org_id);
create index if not exists pulse_checkins_created_at_idx on pulse_checkins(created_at desc);

alter table pulse_checkins enable row level security;

create policy "employees insert own pulse"
  on pulse_checkins for insert
  with check (employee_id in (select id from employees where auth_user_id = auth.uid()));

create policy "employees read own pulse"
  on pulse_checkins for select
  using (employee_id in (select id from employees where auth_user_id = auth.uid()));

create policy "org managers read pulse aggregate"
  on pulse_checkins for select
  using (org_id in (select org_id from employees where auth_user_id = auth.uid() and role in ('admin', 'manager')));
