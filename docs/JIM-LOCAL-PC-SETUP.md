# Jim Local PC Setup

Purpose: record Jim's working local-development setup for ShelterPawtners/LostPaws so future troubleshooting starts from the known-good configuration.

## Durable correction rule

This file is the source of truth for Jim-specific local paths, command locations, environment quirks, and known-good setup steps.

When Jim corrects an assumed path, executable location, command sequence, or local-environment behavior:

1. Treat the correction as authoritative for this project unless later superseded.
2. Update this document when the correction is durable and relevant to future work.
3. Before giving Jim local setup or troubleshooting instructions, consult this document instead of assuming standard Windows installation paths.
4. Do not revert to generic defaults such as `C:\Program Files\Docker` when this document records a different known-good location.
5. Prefer hosted shared-dev QA for Jim's routine UX testing once available; local Docker/Supabase should primarily support engineering, destructive reset testing, and machine-specific reproduction.

## Repository path

Windows repository path:

`C:\Users\jimwa\Documents\GitHub\LostPaws`

## Node / npm

Known working Windows versions on 2026-09-07:

- Node.js: `v22.19.0`
- npm: `10.9.3`

Use the Windows PowerShell terminal for the frontend and local CLI commands unless a task explicitly requires WSL.

## Docker Desktop

Docker Desktop is installed as a per-user application, not under `C:\Program Files\Docker`.

Docker CLI path:

`C:\Users\jimwa\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe`

Known working Docker version on 2026-09-07:

- Docker: `29.7.2`

If a new PowerShell or VS Code terminal cannot find `docker`, add the Docker CLI directory to that terminal session:

```powershell
$env:Path += ";C:\Users\jimwa\AppData\Local\Programs\DockerDesktop\resources\bin"
```

Then verify:

```powershell
docker --version
docker info
```

Important: Docker Desktop itself may already be running even when a stale VS Code terminal cannot resolve `docker`. Treat that as a PATH/session issue before assuming Docker is not installed.

## Supabase CLI

The global `supabase` command is not relied on for Jim's Windows setup.

Use the project-local CLI through `npx`:

```powershell
npx supabase --version
npx supabase start
npx supabase status
```

Known working Supabase CLI version on 2026-09-07:

- Supabase CLI: `2.117.0`

Run Supabase commands from the repository root:

`C:\Users\jimwa\Documents\GitHub\LostPaws`

Known local development endpoints after startup:

- Project/API: `http://127.0.0.1:54321`
- Database: `127.0.0.1:54322`
- Studio: `http://127.0.0.1:54323`
- Mailpit: `http://127.0.0.1:54324`

Do not commit or document local Supabase secret, publishable, storage access, or storage secret keys here. Retrieve current local values with `npx supabase status` when needed.

## Frontend

From the repository root, start the Vite app in a separate PowerShell terminal:

```powershell
npm run dev
```

Keep Docker Desktop and local Supabase running while testing authenticated marketplace/redemption workflows locally.

## Hosted shared QA direction

Routine Jim UX testing is moving away from local Docker/PowerShell setup.

Approved target flow:

1. Codex develops and validates locally.
2. GitHub CI and Playwright run automated checks.
3. Shared Supabase project `shelterpawtners-dev` provides the non-production backend.
4. Vercel provides the hosted HTTPS preview/staging frontend.
5. Jim performs normal browser QA against the hosted URL.
6. Production deployment/DNS remains a separate explicit approval gate.

Vercel was installed and connected through ChatGPT on 2026-09-07. The Vercel API connection responds successfully. No team workspace is currently returned by the connector; treat this as compatible with a personal-account scope, not as evidence that the connection failed.

Until hosted QA is fully operational, local testing may still be required for specific regression checks.

## WSL note

Jim's Ubuntu/WSL environment currently does not have Node.js or the Supabase CLI available by default. For the current LostPaws workflow, prefer Windows PowerShell with Docker Desktop and `npx supabase` rather than duplicating the toolchain in WSL.

## Troubleshooting order

If local Supabase fails to start:

1. Confirm Docker Desktop is visibly running.
2. Run `docker --version` in the same terminal that will run Supabase.
3. If `docker` is not found, add the Docker Desktop CLI directory to that terminal's PATH using the command above.
4. Run `docker info`.
5. From the repo root, run `npx supabase start`.
6. Verify with `npx supabase status`.

This file documents Jim's personal development machine and shared QA direction only. It is not a production deployment specification.
