---
name: setup
version: "1.1.1"
description: First-run onboarding skill. Runs as a guided conversation — infers the user's work/personal context, configures identity, autonomy, channels, tone, and app access with phone-first auth, and seeds routine-skill stubs. Runs only once; onboarding continues through daily use.
allowed-tools: Bash(*) Read(*) Write(*) Edit(*) Glob(*) Grep(*)
metadata:
  author: galiprandi
  tags: [setup, onboarding, init, first-run]
  scope: repo-local
---

# Setup — First-Run Onboarding

## Purpose

This skill runs the **first time** a user opens the assistant repo. It guides an interactive onboarding that configures the agent's identity, behavior, and integrations. The results are persisted to `AGENTS.md` (core function) and to agent-desk (config + first session).

## When to use

- **Trigger:** `agent/profile/identity.md` does not exist or is empty in any subsection (i.e., setup has not been run yet).
- **Run once:** After setup completes, this skill should not run again unless the user explicitly requests reconfiguration.

## Prerequisites

- **Skills up to date** — run `npm run update` before starting setup to ensure the latest skill versions
- `browser-automation` skill installed
- `agent-desk` skill installed
- agent-desk deployed and accessible (default: `https://galiprandi.github.io/agent-desk/`)
- Browser profile created at `.browser-profile/`

## Flow

Run each step in order. Steps 1-7 are **one continuous conversation** — never one question per step; extract answers from free text and only ask for what's missing. Keep everything in the user's language — detect it from their first message.

### Steps 1-3 — The conversation (not a questionnaire)

Run the identity part as **one guided conversation**: 2-3 short exchanges,
not one question per step. Extract everything you can from free answers;
only ask for what's missing. The user should feel they're chatting.
Onboarding does NOT end here — it continues through daily use (see
"Post-setup").

**Step 1 — Who is the user.** Ask openly: "Tell me about yourself — your
name, what you do, how I can help." Capture name, phone, email,
occupation/role, and context (industry, location, language, working
style). Save to `agent/profile/user.md`.

**Step 2 — Work, personal, or both.** Ask what they'll use the agent for.
From the answer **infer** the function and the apps they need (dentist →
appointments/reminders; accountant → taxes/deadlines; etc.) and propose
them — the user adjusts, never starts from zero. Save to
`agent/profile/function.md`.

**Step 3 — Expectations + autonomy.** Fold into the same conversation:
what does success look like, and what may you do alone vs. confirm first.
Offer sensible defaults (autonomous: read, create tasks, search, browse;
needs confirmation: send messages, modify events, delete, post publicly,
pay) and let the user tweak — don't interrogate. Save to
`agent/profile/expectations.md` + `autonomy.md`.

### Step 4 — Notifications + availability

Still inside the same conversation: which channels should the agent notify
on (WhatsApp — linked by phone-number code, no screen needed; email;
Discord; in-app only; none), and active hours or 24/7. Offer defaults;
ask only if the context makes it matter. Save to
`agent/profile/notifications.md` + `availability.md`.

### Step 5 — Tone

Offer "mimic me" as the default once message sources are connected — the
`communication` skill refines the style profile from real samples during
use. Alternatives: own persona, or hybrid. Save the choice; details live
in `agent/profile/communication-style.md` and get filled continuously,
never via a form.

### Step 6 — Routine stubs

While chatting, listen for recurring activities or life domains (gym,
work routines, studies, caretaking, a person's care...). For each one,
create `.agents/skills/<domain>/SKILL.md` as a placeholder stub — see
"Recurring tasks" in `AGENTS.md`. Mention each stub once, in
passing. This is how the profile grows from day one: non-invasively.

### Step 7 — App access

Connect only the apps inferred in Step 2 plus the chosen notification
channels. First ask once: **"When it's time to log in, will you be in
front of this machine's screen, or phone-only (remote)?"** — save the
answer in `agent/profile/`. Then per app, follow "Credentials & login" in
`AGENTS.md`: check the known remote method first (agent fills non-secret
fields, user completes secrets on their phone), never passwords in chat,
never log in for them, verify login and confirm.

Common apps by function:
- Personal assistant: Gmail, Google Calendar, WhatsApp, Outlook
- Project manager: GitHub, Jira, Slack
- Sales/CRM: Gmail, LinkedIn, WhatsApp
- Research: Google, any specific databases

### Step 8 — Browser homepage

1. Create the browser profile at `.browser-profile/` if it doesn't exist
2. Set the homepage to the agent-desk URL
3. Open the browser and verify agent-desk loads
4. Verify `window.agentAPIReady === true`

### Step 9 — Persist to agent-desk

Using `agent-desk` skill (via `eval`):

```bash
# Start first session
agentAPI.session.start({summary: "Initial setup completed"})

# Save config
agentAPI.config.set("user", {name: "<name>", role: "<role>", context: "<context>"})
agentAPI.config.set("agentFunction", "<function from step 2>")
agentAPI.config.set("agentExpectations", [<bullet points from step 3>])
agentAPI.config.set("agentAutonomy", {autonomous: [...], needsConfirmation: [...]})
agentAPI.config.set("notificationChannels", [<channels from step 4>])
agentAPI.config.set("availability", {active: true/false, start: "...", end: "...", timezone: "..."})
agentAPI.config.set("communicationStyle", {<profile from step 5>})
agentAPI.config.set("connectedApps", [<apps from step 7>])
agentAPI.config.set("agentName", "<chosen agent name>")
agentAPI.config.set("agentIdentity", "<identity summary: role + personality>")
agentAPI.config.set("setupComplete", true)

# Create setup tasks
agentAPI.tasks.create({title: "Complete onboarding review", priority: "medium", tags: ["setup"]})
```

### Step 10 — Persist to agent/profile/

Write the profile to files under `agent/profile/` (`identity.md`, `user.md`, `function.md`, `expectations.md`, `autonomy.md`, `notifications.md`, `availability.md`, `communication-style.md`, `apps.md`) with all the collected information. `identity.md` holds the agent name + personality summary. Also ensure the desk mirrors the identity via `agentAPI.config.set("agentName", ...)` / `("agentIdentity", ...)` above.

```text
agent/profile/
├── identity.md            # agent name + personality summary
├── user.md                # <name, role, context from step 1>
├── function.md            # <step 2 answer>
├── expectations.md        # <bullets>
├── autonomy.md            # autonomous / needs-confirmation lists
├── notifications.md       # <channels>
├── availability.md        # <schedule>
├── communication-style.md # <style profile>
└── apps.md                # <connected apps>

### Availability
<active hours or 24/7>

### Communication Style
<step 5 choice or "Own persona">

### Connected Apps
- <app> — <login status>
```

### Step 11 — Security validation

Before finishing, verify that no personal data will leak to GitHub. This is critical — the user's profile, browser data, and credentials must never be pushed.

**Check 1 — .gitignore covers sensitive paths:**

Verify `.gitignore` includes at minimum:
```
.browser-profile/
.playwright-cli/
.playwright-mcp/
.env
.env.*
*.state.json
acp-connector.jsonc
```

If any are missing, add them.

**Check 2 — AGENTS.md privacy decision:**

`agent/` is tracked by default. After setup, `agent/profile/` contains the user's identity, autonomy rules, connected apps, and communication style. If the user pushes this repo anywhere public, all of that is public.

Ask the user:

> Your `agent/` folder will now contain your personal profile. If you push this repo to a public remote, that information will be public. How do you want to handle this?

Options:
- **Keep it local** — don't push at all (default; simplest and safest)
- **Private repo** — push to a private GitHub repo only
- **Accept public** — the user understands and accepts that their profile will be public

Note: `AGENTS.md` stays tracked (it contains no personal data — only the data map and rules). The personal data lives in `agent/profile/`; if the user chooses privacy, add `agent/` to `.gitignore` or push only to a private remote. The folder still functions locally whether tracked or not.

**Check 3 — No secrets staged:**

Run `git status` and verify no sensitive files are staged:
- No `.env`, `.env.*` files
- No `.browser-profile/` contents
- No `*.state.json` files
- No files containing tokens, cookies, or credentials

If any are found, remove them from staging and confirm they're gitignored.

### Step 12 — Phone control (optional connect)

Ask the user:

> Do you want to talk to me from your phone? I can bridge this agent to Telegram and/or Discord — you only log in, I do the rest.

If yes, the agent drives the whole flow — the user does nothing but log in:

1. **Telegram:** open Telegram Web in the agent's own browser
   (`node .agents/skills/browser-automation/scripts/browser.js`), let the
   user log in, then open a chat with **@BotFather**, send `/newbot`,
   walk the bot creation, and capture the token BotFather replies with.
   If the user already has a bot token, ask for it directly instead.
2. **Discord:** open the Discord Developer Portal
   (`discord.com/developers/applications`) in the same browser, let the
   user log in, and guide/perform creating an application + bot to obtain
   the token. Ask the user to invite the bot to their server if they want
   one (or configure it to accept DMs).
3. Ask which agent command to bridge (detect which ACP-compatible agent
   CLI is installed on this machine).
4. Collect the **allowed chat/channel IDs**: send a message to the new bot
   from the user's account, then fetch `getUpdates` with the token
   (Telegram) or read the channel ID from Discord (user enables Developer
   Mode → right-click channel → Copy Channel ID).
5. Write `acp-connector.jsonc` (gitignored) with the collected values and
   the recommended defaults below — don't rely on the wizard alone, it
   doesn't cover the important options.

**Recommended config template** (adjust names, never leave placeholders):

```jsonc
{
  // Per-instance values — MUST be correct when several agents share a machine:
  "agentCmd": "<the ACP command for this agent>",
  "agentCwd": "<absolute path of THIS agent's folder>",  // never another agent's
  // REQUIRED — never omit: a stable sessionId makes acp-connector resume the
  // same agent session, so the agent keeps its context across restarts and
  // messages. Without it every message could start a fresh, amnesic session.
  "sessionId": "<unique slug for this agent, e.g. its name>",

  "platforms": {
    "telegram": { "token": "<bot token>", "allowedChatIds": [<owner chat id>] },
    "discord":  { "token": "<bot token>", "allowedChannelIds": ["<channel id>"] }
    // omit a platform block if not configured
  },

  // UX defaults — recommended, quiet & mobile-friendly:
  "showThoughts": false,
  "showTools": false,
  "showPlan": false,
  "streaming": true,
  "logLevel": "info",

  // HTTP API: opt-in — enable only if the user asks for external integrations.
  // When enabled, port must be unique per agent on the machine (7780+n).
  "http": { "enabled": false },
  "media": { "uploadsDir": "<abs path>/uploads" },   // create the dir; gitignored

  "cron": [],
  "routines": []
  // routines are named reusable prompts — start empty; the agent proposes
  // a few based on the chosen role at the end of setup (see step 14), e.g.:
  // { "name": "ws", "prompt": "Check WhatsApp for new messages, summarize them and prepare numbered draft replies so I can decide which to send" }
}
```

Per-instance checklist (multi-agent machines):
- `agentCwd` = this folder — the bridge must spawn the agent in its own home
- `sessionId` **must be set** and unique per agent (use the agent's name) —
  it's what preserves conversation context across restarts; two agents must
  never share it
- `http.enabled` defaults to `false`; if enabled, pick a port not used by
  other agents on the machine (check their `acp-connector.jsonc`)
- `media.uploadsDir` inside this folder
- `allowedChatIds`/`allowedChannelIds` = the owner's only — never open

6. Test it: `npm run connect` in the background, send a test message to
   the bot, confirm a reply arrives, then stop it (or keep running if the
   user enables always-on next).

If the user declines, skip without pressure — it can be enabled any time
later by asking the agent.

### Step 13 — Always-on (optional)

If connect was configured, ask:

> Do you want me reachable 24/7? I can keep the bridge running as a daemon
> that survives reboots.

If yes:

```bash
npm run daemon          # pm2 start + pm2 save (via npx)
npx pm2 startup         # generates the OS service (systemd/launchd/schtasks)
```

`pm2 startup` may print a command the user must run with sudo/admin — relay
it to them exactly. Manage later with `npm run daemon:logs` and
`npm run daemon:stop`.

### Step 14 — Wrap up

1. Tell the user setup is complete
2. Summarize the configuration
3. If connect was configured, propose 2-3 **routines** tailored to the
   agent's role (e.g. a WhatsApp digest for a personal assistant, a
   deadline check for a taxes agent) — add them to `routines` in
   `acp-connector.jsonc` only with the user's approval
4. If connect/daemon were skipped, note they can enable them any time by
   just asking
5. End the session: `agentAPI.session.end({summary: "Setup complete. Agent configured for <function>."})`
6. Ask if they want to start using the agent now

## Golden rules

- **Conversation, not interrogation** — guided chat, extract from free answers, ask only what's missing
- **User's language** — detect from first message, respond in same language
- **No logins** — the agent never logs in. It opens the app and the user logs in.
- **Phone-first auth** — prefer remote-completable login flows (link codes, push approvals) per the "Credentials & login" rules; never ask for passwords or 2FA codes in chat.
- **No assumptions** — if the user's answer is ambiguous, ask for clarification
- **Save everything** — persist to both AGENTS.md (core) and agent-desk (config + session)
- **Respect privacy** — if the user declines an app or feature, skip it without pressure

## Post-setup

After setup, the agent should:
1. Read `AGENTS.md` on every session start to load its profile
2. Call `agentAPI.session.start()` at the beginning of each work session
3. Call `agentAPI.session.end()` at the end with a summary
4. Use `agent-desk` as its control center for tasks, events, and continuity
5. **Keep onboarding forever** — this skill is the bootstrap, not the whole
   onboarding. Every session, proactively detect and persist new user
   preferences, habits and routines (see "Onboarding is continuous" and
   "Recurring tasks" in AGENTS.md): likes, formats, contacts, brands,
   habits. Recurring activities get `.agents/skills/<domain>/` stubs that
   fill up over time. The profile is never finished.
