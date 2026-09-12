# Hayat Web Admin & Management Dashboard V1

This web application was built against the same Supabase backend and role model used by the Hayat Provider V20.4 mobile application.

## Included web workspaces

- Hayat Platform Super Admin
- Hospital Owner / Super Admin
- Hospital Admin / General Manager
- Department Manager / Supervisor
- Auditor / Compliance
- Human Resources data
- Staff & Access Management
- Branches
- Doctors
- Appointments
- Investigations / Home Services / Health Packages
- Service Requests
- Notifications
- System Readiness

The Owner, Hospital Admin/GM, Department Manager and Auditor pages call the existing RPCs already used by the V16-V20.4 provider app. The platform-level dashboard adds a small secure SQL layer in `supabase/26_web_admin_dashboard_v1.sql`.

## Security model

- Browser uses only the Supabase publishable key.
- Do NOT place the Supabase service-role key in `.env` or frontend code.
- Hospital access continues to be enforced by the existing provider RPCs/RLS.
- Platform-wide access is restricted by `hayat_platform_admins` and server-side `hayat_platform_guard()`.

## Install

### 1. Database

Run:

`supabase/26_web_admin_dashboard_v1.sql`

in Supabase SQL Editor.

Existing V20.4 database migrations must already be installed.

### 2. Configure web app

Copy `.env.example` to `.env`.

The included example already points to the same Supabase project as the V20.4 mobile package.

### 3. Install and run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The production files are generated in `dist/`.

## First Hayat Platform Super Admin

Platform Super Admin is different from a hospital Owner. It controls the complete Hayat platform across all hospitals.

Create a normal Supabase Auth user for the platform administrator, then run once:

```sql
insert into public.hayat_platform_admins(user_id)
select id from auth.users
where lower(email)=lower('YOUR_PLATFORM_ADMIN_EMAIL@example.com')
on conflict (user_id) do update set is_active=true;
```

After that, sign in to the web dashboard with that account.

## Hospital role behavior

- `owner` → Owner Control Center
- `admin` → Hospital Admin / General Manager dashboard
- `department_manager` → Department Manager dashboard
- `auditor` → Audit & Compliance dashboard
- `hr` → HR data workspace

The current V20.4 backend represents Hospital Admin and General Manager with the same `admin` permission role. Their registration department/job title distinguishes Executive Management versus Hospital Administration.

## Deployment

The project is a standard Vite/React SPA. Deploy the contents of `dist/` to any static host. Configure SPA fallback so unknown paths return `index.html`.
