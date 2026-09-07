# Jim Local PC Setup

Purpose: record Jim's working local-development setup for ShelterPawtners/LostPaws so future troubleshooting starts from the known-good configuration.

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

Keep Docker Desktop and local Supabase running while testing authenticated marketplace/redemption workflows.

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

This file documents Jim's personal development machine only. It is not a production deployment specification.
