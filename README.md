# assistant

A **template repository for creating AI agents**. Use this template, run setup, and your agent is ready to operate a browser, manage tasks, and maintain session continuity.

> **[Use this template →](https://github.com/galiprandi/assistant/generate)** — creates a new repo under your account with all the files.

## What you get

- **browser-automation** skill — control a browser via playwright-cli
- **agent-desk** skill — dashboard with sync API for tasks, events, sessions, and config
- **setup** skill — interactive first-run onboarding that configures the user's identity, the agent's role, autonomy, and integrations
- **AGENTS.md** — the agent's identity file (read by all compatible agents)
- **CLAUDE.md** — symlink to AGENTS.md (for Claude Code)

## Quick start

### Option A — Use this template on GitHub

1. Click **[Use this template](https://github.com/galiprandi/assistant/generate)** → name your repo (e.g. `my-agent`) → create
2. Clone your new repo locally:
   ```bash
   git clone git@github.com:<your-user>/my-agent.git
   cd my-agent
   ```
3. Restore skills from the lock file:
   ```bash
   npx skills experimental_install -y
   ```
4. Open the repo with your agent (Claude Code, Devin, Codex, Warp, etc.)

### Option B — Clone directly

```bash
git clone git@github.com:galiprandi/assistant.git
cd assistant
npx skills experimental_install -y
```

Then open with your agent.

### What happens next

The agent will:
1. Read `AGENTS.md` and detect that setup hasn't run yet
2. Run `npx skills update` to ensure skills are current
3. Ask you questions — who you are, what you want it to do, how autonomous it should be
4. Configure itself based on your answers
5. Set up the browser with agent-desk as homepage
6. Save everything to AGENTS.md and agent-desk
7. Run a security validation to ensure no personal data leaks to GitHub

## How it works

```
┌──────────────────────────────────────────────────────┐
│  Agent (Claude, Devin, Codex, etc.)                  │
│                                                      │
│  Reads AGENTS.md → knows its identity & function     │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ browser-     │  │ agent-desk   │  │ setup      │ │
│  │ automation   │  │ (control     │  │ (first-run │ │
│  │ (browser)    │  │  center)     │  │  onboarding│ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│         │                 │                          │
│         ▼                 ▼                          │
│  ┌─────────────┐   ┌──────────────────┐             │
│  │ Browser     │   │ agent-desk app   │             │
│  │ (playwright │   │ (GitHub Pages)   │             │
│  │  -cli)      │   │                  │             │
│  │             │   │ window.agentAPI  │             │
│  │  Tabs:      │   │  tasks           │             │
│  │  - agent-   │   │  events          │             │
│  │    desk     │   │  session         │             │
│  │  - Gmail    │   │  links           │             │
│  │  - WhatsApp │   │  config          │             │
│  │  - etc.     │   │  search          │             │
│  └─────────────┘   └──────────────────┘             │
│                                                      │
│  .browser-profile/ (gitignored, local)              │
└──────────────────────────────────────────────────────┘
```

## Skills

### Installed from `galiprandi/skills`

- **browser-automation** — browser control via playwright-cli (navigate, fill forms, read content)
- **agent-desk** — dashboard API for task/event/session management

### Repo-local

- **setup** — first-run onboarding (not published, lives only in this repo)

## Customization

### Change the agent-desk URL

If you deploy your own agent-desk instance, update the URL in:
- `AGENTS.md` (the agent-desk skill section)
- `.agents/skills/agent-desk/SKILL.md` (if you want to override the default)

### Add more skills

```bash
npx skills add <github-owner>/<repo> --skill <skill-name> -y
```

This updates `skills-lock.json` automatically.

### Update skills

```bash
npx skills update
```

### Reconfigure the agent

Delete the `## Agent Profile` section content in `AGENTS.md` and restart. The agent will run setup again.

## Data and privacy

- **Browser profile** (`.browser-profile/`) is gitignored — never committed
- **agent-desk data** lives in IndexedDB, scoped to the browser profile
- **No backend** — everything is local or static
- **No telemetry** — the agent doesn't phone home
- **Setup runs a security validation** — verifies `.gitignore` covers sensitive paths, asks how to handle `AGENTS.md` (private repo / gitignore / accept), and checks no secrets are staged before finishing
- If the browser profile is deleted, all agent-desk data is lost

## Requirements

- Node.js 22+
- npx (comes with Node)
- A compatible AI agent (Claude Code, Devin, Codex, Warp, etc.)
- playwright-cli (installed by browser-automation skill)

## License

MIT
