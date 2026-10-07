# assistant

A **self-contained home for your AI agent**. Bring your own agent (Devin, Claude Code, OpenCode, Codex, Gemini CLI — anything that speaks [ACP](https://agentclientprotocol.com/)) — this repo gives it an identity, a real browser, task management, and session continuity. Optionally bridge it to Telegram or Discord so you can chat from your phone.

Powered by your agent + [acp-connector](https://github.com/galiprandi/acp-connector) (optional Telegram/Discord bridge) + [Playwright](https://playwright.dev) (browser automation).

## Create a new agent

You need an agent that can run shell commands (Devin, Claude Code, OpenCode, Codex, Gemini CLI — anything ACP-compatible). That's the only requirement — the agent does the install.

**Paste this to your agent:**

```
Install a personal assistant following https://raw.githubusercontent.com/galiprandi/assistant/main/SETUP.md
```

The agent will:

1. Verify Node ≥22 and git (and install them with your permission if missing)
2. Ask you for a folder name and clone the repo there — no fork needed
3. Create `AGENTS.md`, install the browser, and ask your assistant's name
4. Run the onboarding right there — it asks who you are, what you want, and which apps to connect

> Each assistant is just a folder. Clone as many as you want with different names — separate browser, separate bots, separate data. No collision.

## What you get

- **Agent-agnostic** — works with any ACP-compatible agent; the repo is the identity, the agent is replaceable
- **Telegram/Discord control (optional)** — chat with your agent from anywhere via [acp-connector](https://github.com/galiprandi/acp-connector), or just use your IDE/CLI
- **Browser automation** — the agent operates a real Chromium browser (Gmail, WhatsApp, LinkedIn, and more)
- **Task management** — built-in dashboard with tasks, events, sessions, and search (agent-desk)
- **Self-contained** — everything lives in this repo, no external services required
- **Container-ready** — package it in Docker, deploy to Coolify, run multiple isolated agents

## Launch

After the initial setup, open the assistant's folder with your agent CLI/IDE:

```bash
cd assistant
devin        # or claude, opencode, ...
```

The agent reads `AGENTS.md` — that's its identity, skills, and rules. The folder is the assistant's home; whoever runs there becomes the assistant.

## Connect to Telegram or Discord (optional)

The onboarding offers this at the end — or just ask your agent anytime: *"connect me to Telegram"*. The agent opens Telegram Web or the Discord Developer Portal **in its own browser**, you only log in, and it obtains the bot token and writes `acp-connector.jsonc` (gitignored — contains bot tokens) itself. Zero manual steps.

To run the bridge manually:

```bash
npm run connect        # bridge in the foreground
npm run connect:setup  # acp-connector wizard (terminal alternative)
```

acp-connector also supports routines (named reusable prompts), cron jobs, and an optional HTTP API — see its README for details.

## Always-on (optional)

Keep the bridge running 24/7 as a daemon — survives reboots:

```bash
npm run daemon         # pm2 start + save (via npx)
npx pm2 startup        # one-time: installs the OS service (systemd/launchd/schtasks)
```

Manage it with `npm run daemon:logs` and `npm run daemon:stop`.

## Commands

```
npm run connect        Bridge to Telegram/Discord via acp-connector
npm run daemon         Run the bridge always-on via pm2
npm run update         Pull repo updates (git pull) + update skills
```

## Architecture

```
┌─────────────────── Your machine / container ──────────────────┐
│                                                                │
│  Your agent CLI (devin, claude, opencode, ...)                │
│     │                                                          │
│     ▼                                                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Any ACP-compatible agent                                │ │
│  │                                                          │ │
│  │  Reads AGENTS.md → knows its identity & function         │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐                      │ │
│  │  │ browser-     │  │ agent-desk   │                      │ │
│  │  │ automation   │  │ (task/event  │                      │ │
│  │  │ (browser)    │  │  dashboard)  │                      │ │
│  │  └──────┬───────┘  └──────┬───────┘                      │ │
│  │         │                 │                              │ │
│  │         ▼                 ▼                              │ │
│  │  ┌─────────────┐  ┌──────────────┐                       │ │
│  │  │ Chromium    │  │ agent-desk   │                       │ │
│  │  │ (Playwright │  │ (IndexedDB)  │                       │ │
│  │  │  -cli)      │  │              │                       │ │
│  │  │ Tabs:       │  │ tasks        │                       │ │
│  │  │  Gmail      │  │ events       │                       │ │
│  │  │  WhatsApp   │  │ sessions     │                       │ │
│  │  │  LinkedIn   │  │ links        │                       │ │
│  │  │  etc.       │  │ search       │                       │ │
│  │  └─────────────┘  └──────────────┘                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Optional: npm run connect / daemon                            │
│     │                                                          │
│     ▼                                                          │
│  ┌──────────────────┐      ┌──────────────┐                    │
│  │  acp-connector   │ ───▶ │  Telegram /  │                    │
│  │  (spawned agent  │      │  Discord     │                    │
│  │   via ACP)       │ ◀─── │  bots        │                    │
│  └──────────────────┘      └──────────────┘                    │
│                                                                │
│  acp-connector.jsonc     ← bot tokens (gitignored)            │
│  .browser-profile/       ← browser sessions (gitignored)      │
│  .assistant/             ← local state (gitignored)           │
└────────────────────────────────────────────────────────────────┘
         ↑                                          ↑
         │                                          │
    Your terminal/IDE                           Your phone
                                              (Telegram/Discord)
```

## Skills

### Installed from `galiprandi/skills` (maintained)

- **browser-automation** — control a browser via playwright-cli (navigate, fill forms, read content, call internal site APIs)
- **agent-desk** — dashboard with sync API for tasks, events, sessions, and config
- **android-automation** — control an Android device via adb

> **Security invariant:** agents must always use the repo's own
> `browser-automation` script (`node .agents/skills/browser-automation/scripts/browser.js`)
> and `android-automation` for device tasks — never the agent harness's
> built-in browser/emulator. That keeps every session cookie inside this
> repo's `.browser-profile/`, so credentials never leak outside the agent's
> self-contained perimeter.

### Repo-local

- **setup** — first-run onboarding (not published, lives only in this repo)
- **learned skills** — the agent creates new skills under `.agents/skills/` when it discovers repeatable routines, capturing the steps and your preferences

## Updating

```bash
npm run update
```

This runs `git pull` (your clone tracks the upstream repo) and updates skills to their latest versions — all in one command. Your `## Agent Profile` section in `AGENTS.md`, `acp-connector.jsonc`, and personal data are never touched upstream, so merges stay clean. If `AGENTS.md` changed, review the `## What's new` section.

### Manual updates

```bash
# Update skills only
npx skills update -y

# Restore skills from lock file (after a fresh clone)
npx skills experimental_install -y
```

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

### Reconfigure the agent

Edit the `## Agent Profile` section of your `AGENTS.md` — upstream updates never touch it. When `AGENTS.md` changes upstream, review the `## What's new` section after `npm run update`.

To start fresh: reset the profile section to its placeholders, or re-run the `setup` skill.

### Switch agents

Nothing to reconfigure — run a different agent CLI in the directory and it picks up the same `AGENTS.md` identity. For the chat bridge, edit `agentCmd` in `acp-connector.jsonc`.

## Container deployment

Each agent runs as an isolated container with its own browser, its own data, and its own bots. Deploy to Coolify, Docker Compose, or any container platform.

**What persists (mount as a volume):**
- `.browser-profile/` — browser sessions (cookies, localStorage, IndexedDB → includes agent-desk data)
- `.playwright/` — playwright-cli workspace marker (required for per-repo session isolation — see below)
- `acp-connector.jsonc` — bridge config (bot tokens), if using Telegram/Discord
- Your agent's own session/config dirs (e.g. `~/.claude`, `~/.config/devin`)

**Why `.playwright/` matters (multi-agent setups):** playwright-cli isolates sessions per *workspace*, detected by walking up from the cwd looking for a `.playwright` directory. Without it, the workspace resolves to the CLI package root — so **every agent repo without the marker shares a single "default" session and ends up driving whichever browser is already running** (a different agent's profile, logins and all). The marker (plus a small `cli.config.json` inside) gives each repo its own daemon socket and its own `.browser-profile`. Never delete it.

**What's configured per-agent:**
- The agent CLI you install and its auth — that's your agent's concern, not this repo's

Multiple agents = multiple containers, same image, different volumes. No collision.

## Data and privacy

- **`AGENTS.md`** — tracked (it's the template); your personal data lives only in `## Agent Profile`. Setup asks how to handle privacy: keep the repo private (recommended) or accept the profile is public if you push
- **`acp-connector.jsonc`** — Telegram/Discord bot tokens, gitignored
- **`.browser-profile/`** — browser sessions, gitignored
- **agent-desk data** lives in IndexedDB, scoped to the browser profile
- **No backend** — everything is local or static
- **No telemetry** — the repo doesn't phone home
- **Setup runs a security validation** — verifies `.gitignore` covers sensitive paths, asks how to handle `AGENTS.md` (private repo / gitignore / accept), and checks no secrets are staged before finishing
- If the browser profile is deleted, all agent-desk data is lost

## Requirements

- **An agent that can run shell commands** — e.g. [Devin](https://devin.ai), [Claude Code](https://claude.com/product/claude-code), [OpenCode](https://opencode.ai), Codex, Gemini CLI. This is the only hard requirement: the agent installs everything else.
- Node.js 22+ and git — the agent checks (and installs them with your permission) during setup
- Optional: Telegram or Discord account if you want chat control — the agent obtains the bot tokens itself during onboarding, you only log in

## Repo structure

```
assistant/
├── AGENTS.md                   # Agent identity + your profile section (tracked)
├── SETUP.md                    # Agent-facing install instructions (paste its URL to your agent)
├── acp-connector.jsonc         # Telegram/Discord bridge config (gitignored, optional)
├── README.md                   # This file
├── LICENSE                     # MIT
├── package.json                # npm scripts: connect, daemon, update (+ docs tooling)
├── .gitignore                  # Ignores .browser-profile/, acp-connector.jsonc, etc.
├── .playwright/                # playwright-cli workspace marker — REQUIRED for per-repo session isolation
│   └── cli.config.json         # browser channel, timeouts, ad/tracker blocking
├── skills-lock.json            # Lock file for skill versions
├── .agents/
│   └── skills/
│       ├── browser-automation/ # Browser control via playwright-cli
│       │   ├── SKILL.md
│       │   ├── scripts/browser.js
│       │   ├── references/     # golden-rules, api-capture, etc.
│       │   └── sites/          # per-app guides (gmail, whatsapp, ...)
│       ├── android-automation/ # Android control via adb
│       ├── agent-desk/         # Dashboard API for tasks/events/sessions
│       │   ├── SKILL.md
│       │   └── references/
│       ├── setup/              # First-run onboarding (repo-local)
│       └── <learned>/          # Skills the agent creates for repeatable routines
└── .claude/
    └── skills/                 # Symlinks → .agents/skills/ (for Claude Code)
```

## License

MIT
