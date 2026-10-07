# SETUP.md — Install a new agent

> **Instructions for an AI agent, not for a human.**
> If you are a human: paste this file's URL to any agent that can run shell
> commands (Devin, Claude Code, OpenCode, Codex, Gemini CLI — your harness)
> and it will do the whole install for you:
>
> ```
> Install a personal agent following https://raw.githubusercontent.com/galiprandi/assistant/main/SETUP.md
> ```

## Rules for the agent

- Converse in the user's language.
- **Ask before installing anything** — install only with the user's OK.
- **One agent = one folder.** The user may run several agents on the same
  machine (taxes, marketing, personal, ...), each in its own folder with its
  own browser profile, skills, data and bots. Never reuse another agent's
  folder.
- **MANDATORY SECURITY RULE — session isolation:** every web task must go
  through the repo's own script:

  ```bash
  node .agents/skills/browser-automation/scripts/browser.js <command>
  ```

  Never use the harness's built-in browser/emulator tools — even if they
  exist and look more convenient. The repo's `.browser-profile/` holds the
  agent's cookies and sessions; using an external browser would leak them
  outside the agent's self-contained perimeter. Same rule for Android tasks:
  always `android-automation` via adb.
- Adapt commands to the user's OS and shell. If bash isn't available
  (plain Windows), run the equivalent npm/node commands directly.
- Do the whole flow in this session — no restarts needed.

## Steps

### 1. Check prerequisites

- `node --version` must be ≥ 22
- `git --version` must exist

If anything is missing: **ask the user for permission and install it** using
the appropriate method for their OS (winget on Windows, brew on macOS,
apt/dnf/pacman on Linux). If the user declines or installation isn't
possible, explain what's needed and stop.

### 2. Name the agent, its role, then the folder

Ask the user in this order — each answer suggests the next:

1. **Agent's name** — "What do you want to call your agent?" (e.g. Donna)
2. **Agent's role** — what's this agent for? Examples: personal assistant,
   taxes/accounting, social media & marketing, research, sales. The role
   shapes the Agent Profile and which apps get connected later.
3. **Folder name** — suggest a slug derived from the name (e.g. `donna`,
   `donna-taxes`). If it already exists and isn't empty, propose another
   slug. Confirm with the user before cloning.

```bash
git clone https://github.com/galiprandi/assistant.git <folder>
cd <folder>
```

Then write the name (and role if it fits) into `AGENTS.md` under
`## Agent Profile` → `### Agent`, e.g. `- **Name:** Donna`,
`- **Role:** taxes`.

### 3. Install the browser

Install the browser used by the browser-automation skill (~150MB, warn the
user it may take a moment):

```bash
npm install -g @playwright/cli@latest
playwright-cli install-browser
```

The `.playwright/` marker directory already ships in the repo — it makes
playwright-cli isolate this agent's session in `.browser-profile/`. Never
delete it; without it the browser session could attach to another agent's
profile on the same machine.

### 4. Install skills

All skills pinned in `skills-lock.json`:

```bash
npx skills experimental_install -y
```

### 5. Run the onboarding

Read `.agents/skills/setup/SKILL.md` and execute it now, in this session.
The setup skill asks the remaining questions (function, autonomy, apps,
tone) and drives the logins — guide the user through them.

At the end it will also offer, optionally:

- **Phone control (connect)** — the agent opens Telegram Web or Discord in
  its own browser, the user only logs in, and the agent obtains the bot
  token and writes `acp-connector.jsonc` itself. The user does nothing else.
  Test it with `npm run connect`.
- **Always-on** — run the bridge as a daemon so the agent stays reachable
  after reboots: `npm run daemon` (pm2 via npx), then `npx pm2 startup`
  for the OS-level service and `npx pm2 save`. Manage with
  `npm run daemon:logs` / `npm run daemon:stop`.

### 6. Hand off

When setup finishes, tell the user:

- For future sessions, open `<folder>` with their agent CLI/IDE — that folder
  is the agent's home and identity.
- `npm run update` pulls template updates and refreshes maintained skills.
- If they skipped connect/daemon, they can ask the agent to enable them any
  time — the setup steps are repeatable.
