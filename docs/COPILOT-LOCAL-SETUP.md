# ShelterPawtners Copilot Local Setup

This repository carries its shared Copilot agents, skills, and core plugin configuration in Git. Keep local setup small; do not install overlapping tools without a clear need.

## Automatic from the repository

After this Stream 1 setup is merged, contributors/Copilot can discover:

- custom agents under `.github/agents/`;
- project skills under `.github/skills/`;
- path-specific instructions under `.github/instructions/`;
- repository Copilot settings under `.github/copilot/settings.json`;
- the official Vercel plugin is enabled declaratively for repository-scoped Copilot clients that support repository plugin settings.

## Recommended local setup

### 1. Vercel plugin in VS Code

If the Vercel plugin is not already visible in VS Code Copilot:

1. Open Extensions.
2. Search for `@agentPlugins vercel`.
3. Install the official Vercel plugin.

Copilot CLI alternative:

```bash
npx plugins add vercel/vercel-plugin
```

The repository also declares `vercel/vercel-plugin` in `.github/copilot/settings.json` for supported Copilot repository/cloud contexts.

### 2. Official Supabase Agent Skills

From the repository root:

```bash
npx skills add supabase/agent-skills
```

Supabase installs skills at project scope by default. Keep them updated periodically with:

```bash
npx skills update
```

Do not treat these skills as permission to weaken RLS or bypass the repository migration/test workflow.

### 3. Chrome DevTools plugin/MCP

Recommended for deliberate runtime/performance/accessibility diagnosis; it is not required for every coding task.

VS Code preferred setup:

1. Open Command Palette.
2. Run `Chat: Install Plugin From Source`.
3. Enter `ChromeDevTools/chrome-devtools-mcp`.

Copilot CLI MCP setup:

1. Start `copilot`.
2. Run `/mcp add`.
3. Name: `chrome-devtools`.
4. Type: Local.
5. Command: `npx -y chrome-devtools-mcp@latest`.

Do not add browser/debug MCPs merely to increase tool count; use Chrome DevTools when network, console, Lighthouse/Core Web Vitals, layout shifts, or runtime diagnosis requires it.

## Verification

In Copilot CLI:

```text
/plugin
/skills list
/agent
```

Confirm the repository-specific skills/agents are visible before a design sprint.

## Deferred intentionally

- Figma: not required for the MVP design-hardening loop.
- Storybook: introduce during the Marketplace Sprint after reusable marketplace components/states emerge.
- Supabase MCP write access: not required; evaluate read-only/project-scoped access later if it materially speeds diagnosis.
- Chromatic/Percy/BrowserStack: defer until native Playwright/visual QA is insufficient.
