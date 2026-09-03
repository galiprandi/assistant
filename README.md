# assistant

A **self-contained AI agent** you control from Telegram. Launch it, configure your LLM provider, and chat with your agent from your phone — it runs a real browser, manages tasks, and maintains session continuity.

Powered by [Pi](https://pi.dev) (agent runtime) + [Pigram](https://github.com/galiprandi/pigram) (Telegram bridge) + [Playwright](https://playwright.dev) (browser automation).

## What you get

- **Telegram control** — chat with your agent from anywhere via a Telegram bot
- **Browser automation** — the agent operates a real Chromium browser (Gmail, WhatsApp, LinkedIn, and more)
- **Task management** — built-in dashboard with tasks, events, sessions, and search (agent-desk)
- **15+ LLM providers** — Anthropic, OpenAI, Google, Groq, OpenRouter, xAI, DeepSeek, and more
- **Self-contained** — everything installs from this repo, no external services required
- **Container-ready** — package it in Docker, deploy to Coolify, run multiple isolated agents

## Quick start

### 1. Clone

```bash
git clone --recurse-submodules git@github.com:galiprandi/assistant.git
cd assistant
```

### 2. Configure

```bash
./Assistant init
```

This asks for:
- **Provider** — which LLM provider (anthropic, openai, google, etc.)
- **Model** — which model ID (e.g. `claude-sonnet-4-5-20250929`)
- **API key** — saved to `.env` (gitignored, never committed)

It also installs pigram (the Telegram bridge) from the bundled fork.

### 3. Create a Telegram bot

1. Open [@BotFather](https://t.me/BotFather) in Telegram
2. Send `/newbot`, pick a name and username
3. Copy the bot token

### 4. Launch

```bash
./Assistant
```

Pi launches with your configured provider and pigram loaded. Inside the Pi session, run:

```
/pigram-setup
```

Paste your Telegram bot token. Then open your bot in Telegram and send `/start` to pair your account.

Done. Send any message to your bot and it's forwarded to the agent.

## Commands

```
./Assistant init     Configure provider, model, and API key (saves to .env)
./Assistant update   Pull latest repo + update skills + sync pigram from fork
./Assistant          Launch pi with saved config and pigram loaded
```

## Architecture

```
┌─────────────────── Your machine / container ──────────────────┐
│                                                                │
│  ./Assistant                                                   │
│     │                                                          │
│     ▼                                                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Pi (agent runtime)                                      │ │
│  │                                                          │ │
│  │  Reads AGENTS.md → knows its identity & function         │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐     │ │
│  │  │ browser-     │  │ agent-desk   │  │ pigram     │     │ │
│  │  │ automation   │  │ (task/event  │  │ (Telegram  │     │ │
│  │  │ (browser)    │  │  dashboard)  │  │  bridge)   │     │ │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘     │ │
│  │         │                 │                 │            │ │
│  │         ▼                 ▼                 ▼            │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Chromium    │  │ agent-desk   │  │ Telegram     │    │ │
│  │  │ (Playwright │  │ (IndexedDB)  │  │ Bot API      │    │ │
│  │  │  -cli)      │  │              │  │              │    │ │
│  │  │             │  │ tasks        │  │ ← messages   │    │ │
│  │  │ Tabs:       │  │ events       │  │ → replies    │    │ │
│  │  │  Gmail      │  │ sessions     │  │              │    │ │
│  │  │  WhatsApp   │  │ links        │  │              │    │ │
│  │  │  LinkedIn   │  │ search       │  │              │    │ │
│  │  │  etc.       │  │              │  │              │    │ │
│  │  └─────────────┘  └──────────────┘  └──────────────┘    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  .env                    ← provider + API key (gitignored)    │
│  .browser-profile/       ← browser sessions (gitignored)     │
│  .pi/                    ← pi config + pigram state (gitignored) │
└────────────────────────────────────────────────────────────────┘
         ↑                                          ↑
         │                                          │
    Your terminal                               Your phone
                                              (Telegram app)
```

## Skills

### Installed from `galiprandi/skills`

- **browser-automation** — control a browser via playwright-cli (navigate, fill forms, read content, call internal site APIs)
- **agent-desk** — dashboard with sync API for tasks, events, sessions, and config

### Repo-local

- **setup** — first-run onboarding (not published, lives only in this repo)

### Pigram (Telegram bridge)

Installed from [`galiprandi/pigram`](https://github.com/galiprandi/pigram) (fork with bug fixes). Pigram bridges Telegram messages to Pi and back — you chat with your agent from your phone.

Key pigram commands (inside a Pi session):
- `/pigram-setup` — configure the Telegram bot token and start the bridge
- `/pigram-connect` — reconnect the bridge using an existing config
- `/pigram-disconnect` — stop the bridge
- `/pigram-status` — show config, scope, paired user, and polling state
- `/pigram-notify [on|off]` — forward terminal replies to Telegram (useful when working from the laptop)

## Updating

```bash
./Assistant update
```

This pulls the latest changes from the repo, updates skills to their latest versions, and reinstalls pigram from the fork — all in one command.

### Manual updates

```bash
# Update skills only
npx skills update -y

# Restore skills from lock file (after a fresh clone)
npx skills experimental_install -y

# Reinstall pigram from fork
pi install git:github.com/galiprandi/pigram
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

Edit your `AGENTS.md` (gitignored, personal copy). The template is `AGENTS.example.md` — when it updates, `./Assistant update` warns you to review the "## Novedades" section and copy what you want.

To start fresh: delete `AGENTS.md` and run `./Assistant init` (recreates it from the template).

### Change LLM provider or model

```bash
./Assistant init
```

Re-runs the config wizard and overwrites `.env`.

## Container deployment

Each agent runs as an isolated container with its own browser, its own data, and its own Telegram bot. Deploy to Coolify, Docker Compose, or any container platform.

**What persists (mount as a volume):**
- `.browser-profile/` — browser sessions (cookies, localStorage, IndexedDB)
- `.pi/sessions/` — Pi session history (conversation tree)
- `.pi/pigram.json` — pigram config (bot token)
- `.pi/tmp/pigram/state.json` — pigram runtime state

**What's configured via env vars:**
- `PI_PROVIDER` — LLM provider
- `PI_MODEL` — model ID
- `<PROVIDER>_API_KEY` — API key (e.g. `ANTHROPIC_API_KEY`)

Multiple agents = multiple containers, same image, different env vars and volumes. No collision.

## Data and privacy

- **`.env`** — provider config and API key, gitignored, never committed
- **`AGENTS.md`** — your personal agent config, gitignored (template is `AGENTS.example.md`)
- **`.browser-profile/`** — browser sessions, gitignored
- **`.pi/`** — Pi config, pigram token, session history, gitignored
- **agent-desk data** lives in IndexedDB, scoped to the browser profile
- **No backend** — everything is local or static
- **No telemetry** — the agent doesn't phone home
- **Setup runs a security validation** — verifies `.gitignore` covers sensitive paths, asks how to handle `AGENTS.md` (private repo / gitignore / accept), and checks no secrets are staged before finishing
- If the browser profile is deleted, all agent-desk data is lost

## Requirements

- Node.js 22+
- npx (comes with Node)
- A Telegram bot token (from [@BotFather](https://t.me/BotFather))
- An LLM API key (Anthropic, OpenAI, Google, etc.)
- playwright-cli (installed by browser-automation skill on first browser use)

## Repo structure

```
assistant/
├── Assistant                   # Launcher script (init, update, run)
├── AGENTS.example.md           # Agent identity template (trackeado, se actualiza)
├── AGENTS.md                   # Tu config personal (gitignored, copia del example)
├── CLAUDE.md                   # Symlink → AGENTS.md (for Claude Code)
├── README.md                   # This file
├── LICENSE                     # MIT
├── .gitignore                  # Ignores .env, .browser-profile/, .pi/, etc.
├── skills-lock.json            # Lock file for skill versions
├── package.json                # Pi dependency
├── .gitmodules                 # Pigram submodule reference
├── pigram/                     # Pigram source (git submodule, for reference)
├── .agents/
│   └── skills/
│       ├── browser-automation/ # Browser control via playwright-cli
│       │   ├── SKILL.md
│       │   ├── scripts/browser.js
│       │   ├── references/     # golden-rules, api-capture, etc.
│       │   └── sites/          # per-app guides (gmail, whatsapp, ...)
│       ├── agent-desk/         # Dashboard API for tasks/events/sessions
│       │   ├── SKILL.md
│       │   └── references/
│       └── setup/              # First-run onboarding (repo-local)
└── .claude/
    └── skills/                 # Symlinks → .agents/skills/ (for Claude Code)
```

## License

MIT
