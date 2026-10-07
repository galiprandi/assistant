---
layout: home

hero:
  name: Assistant
  text: Your personal assistant
  tagline: Teach it a routine once, it does it alone. Answers WhatsApp, sends emails, browses websites. Control it from Telegram, Discord, or your IDE.
  actions:
    - theme: brand
      text: Get started
      link: '#getting-started'
    - theme: alt
      text: View on GitHub
      link: https://github.com/galiprandi/assistant

features:
  - title: Handles repetitive tasks
    details: Teach it a routine once and it repeats it on demand. Check messages, send emails, browse sites, download reports.
    icon: 🔄
  - title: Drives a real browser
    details: Operates a real Chromium. It goes into WhatsApp, Gmail, LinkedIn and any website just like you would.
    icon: 🌐
  - title: Telegram & Discord optional
    details: Run your assistant from your phone with a Telegram or Discord bot. Or use it from your IDE. Your call.
    icon: 💬
  - title: Your favorite agent
    details: Works with any agent that can run shell commands: Devin, Claude Code, OpenCode, Codex, Gemini CLI. The repo is the identity — the agent is your choice.
    icon: 🧠
  - title: Multi-assistant
    details: Each assistant is just a folder. Run several isolated assistants on the same machine, each with its own browser, bots and data.
    icon: 🤖
  - title: Your data stays yours
    details: Everything runs locally. No cloud, no telemetry, no backend. Your keys and your browser stay on your machine.
    icon: 🔒
---

## What it is

Assistant is a home for your personal agent: a repo holding its identity, its skills and its memory. Show it a task once (reply on WhatsApp, send an email, download a report from some site) and next time you just say "do the usual" and it does it.

It doesn't ship its own agent — you bring the one you already use (Devin, Claude Code, OpenCode, any agent that can run shell commands). The repo provides the identity; the agent is replaceable.

## What you need

- **An agent that can run commands** — that's the only requirement. The agent installs everything else:
  - [Devin](https://devin.ai)
  - [Claude Code](https://claude.com/product/claude-code) (Anthropic)
  - [OpenCode](https://opencode.ai) (open source)
  - Codex, Gemini CLI, or any other agent with a terminal
- **Telegram or Discord** (optional) — only if you want to control it from your phone

## Getting started

### 1. Paste this to your agent

```
Install a personal assistant following these instructions:
https://raw.githubusercontent.com/galiprandi/assistant/main/SETUP.md
```

### 2. Your agent does everything

Your agent will:

- Verify Node and git — and if missing, **it asks and installs them with your OK**
- Ask you for a folder name and clone the repo there (no fork needed)
- Install the browser the assistant uses
- Ask what you want to call your assistant
- Start the onboarding in that same session: it asks you a few questions, requests the accesses it needs, and you're done

You can repeat the process as many times as you want: **each assistant is a different folder**, with its own browser, bots and data. Nothing collides.

### 3. Next time

Open your assistant's folder with your IDE of choice and keep talking. The folder is its home: its identity, skills and memory live there.

### 4. Connect it to Telegram or Discord (optional)

At the end of onboarding the agent asks if you want phone control. If you say yes, **it does everything**: opens Telegram Web or the Discord Developer Portal in its own browser, you only log in, and it creates the bot, grabs the token and writes `acp-connector.jsonc` (gitignored). Message your bot and the assistant replies.

You can also enable it anytime later — just ask: *"connect me to Telegram"*.

Want it reachable 24/7? Ask for always-on and it runs the bridge as a daemon via pm2 (`npm run daemon` + `npx pm2 startup`), surviving reboots.

## What it can do

Some things you can ask for:

- "Check WhatsApp and tell me what's new"
- "Reply to Juan on WhatsApp saying X"
- "Send an email to Y with the Z report"
- "Go into site X and download the monthly report"
- "Check LinkedIn and tell me if there are new messages"
- "Do the usual" → repeats the last routine you taught it

You teach a routine by showing the steps once. Next time, just ask and it does it alone.

## Commands

```bash
npm run connect       # Telegram/Discord bridge via acp-connector
npm run daemon        # Bridge always-on via pm2 (survives reboots)
npm run update        # Pull repo updates and refresh skills
```

And one security guarantee worth knowing: the assistant only ever browses through its own automation script with its own `.browser-profile/` — never your agent's built-in browser. Your session cookies never leave the folder.

## Your data is yours

- `AGENTS.md` — your assistant's identity; your personal data lives only in the Agent Profile section
- `acp-connector.jsonc` — your bot tokens, never committed
- `.browser-profile/` — browser sessions, local
- Learned skills live in `.agents/skills/` — your routines and preferences, local to this instance

No cloud. No telemetry. No backend. Everything on your machine.

## Built with

- Your favorite agent — [Devin](https://devin.ai), [Claude Code](https://claude.com/product/claude-code), [OpenCode](https://opencode.ai), etc.
- [acp-connector](https://github.com/galiprandi/acp-connector) — optional Telegram/Discord bridge
- [Playwright](https://playwright.dev) — browser automation
