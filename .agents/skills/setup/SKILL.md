---
name: setup
version: "1.0.0"
description: First-run onboarding skill. Guides the user through defining the agent's role, autonomy limits, notification channels, availability, tone/persona, and app access. Runs only once during initial setup.
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

- **Trigger:** `AGENTS.md` does not contain a `## Agent Profile` section (i.e., setup has not been run yet).
- **Run once:** After setup completes, this skill should not run again unless the user explicitly requests reconfiguration.

## Prerequisites

- `browser-automation` skill installed
- `agent-desk` skill installed
- agent-desk deployed and accessible (default: `https://galiprandi.github.io/agent-desk/`)
- Browser profile created at `.browser-profile/`

## Flow

Run each step in order. Ask the user one question at a time. Wait for their answer before proceeding. Keep the conversation in the user's language — detect it from their first message.

### Step 1 — Core function

Ask the user:

> What is your agent's primary function? What do you expect it to do for you?

Examples to offer:
- Personal assistant (email, calendar, messages)
- Project manager (track tasks, deadlines, dependencies)
- Research assistant (gather, summarize, organize information)
- Sales/CRM (track contacts, follow-ups, pipeline)
- Custom (describe your use case)

Save the answer. This becomes the `## Agent Profile → Function` section in `AGENTS.md`.

### Step 2 — Expectations

Ask:

> What specific outcomes do you expect from the agent? What does success look like?

Let the user describe freely. Summarize into 3-5 bullet points. Save as `## Agent Profile → Expectations` in `AGENTS.md`.

### Step 3 — Autonomy limits

Ask:

> What can the agent do on its own without asking, and what requires your confirmation?

Offer defaults:
- **Autonomous:** read emails, create tasks, search, summarize, browse
- **Needs confirmation:** send messages/emails, modify calendar events, delete data, post publicly, make payments

Let the user customize. Save as `## Agent Profile → Autonomy` in `AGENTS.md`.

### Step 4 — Notification channels

Ask:

> How should the agent notify you? Which channels?

Options:
- WhatsApp (requires WhatsApp Web login)
- Email (requires Gmail/Outlook login)
- Discord (requires Discord login)
- In-app only (agent-desk dashboard)
- None

Save as `## Agent Profile → Notifications` in `AGENTS.md`.

### Step 5 — Availability

Ask:

> Does the agent have active hours, or should it be available 24/7?

If active hours: ask for start/end times and timezone.

Save as `## Agent Profile → Availability` in `AGENTS.md`.

### Step 6 — Tone and persona

Ask:

> Do you want the agent to mimic your communication style (by reading your past messages/emails), or should it adopt its own persona?

Options:
- **Mimic me:** The agent reads sample conversations/emails to learn the user's tone, vocabulary, and style. It writes as if it were the user.
- **Own persona:** The agent adopts a neutral, professional tone distinct from the user.
- **Hybrid:** The agent uses its own persona but adjusts formality/language to match the user's context.

If the user chooses "Mimic me":
1. Ask which sources to read (Gmail sent folder, WhatsApp chats, etc.)
2. Use `browser-automation` to navigate to those sources
3. Analyze tone, vocabulary, sentence structure, formality level
4. Save a `## Communication Style` profile in `AGENTS.md` with:
   - Language(s) used
   - Formality level (1-5)
   - Common phrases / expressions
   - Average sentence length
   - Emoji usage (yes/no, which ones)
   - Greeting/sign-off style

### Step 7 — App access

Based on the core function (Step 1) and notification channels (Step 4), determine which apps the agent needs access to. For each app:

1. Tell the user: "I need access to [app name]. I'll open it in the browser — please log in."
2. Use `browser-automation` to open the app URL in a new tab
3. Wait for the user to log in (do NOT log in for them — golden rule)
4. Verify login succeeded (check for logged-in indicators)
5. Confirm with the user

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
agentAPI.config.set("agentFunction", "<function from step 1>")
agentAPI.config.set("agentExpectations", [<bullet points from step 2>])
agentAPI.config.set("agentAutonomy", {autonomous: [...], needsConfirmation: [...]})
agentAPI.config.set("notificationChannels", [<channels from step 4>])
agentAPI.config.set("availability", {active: true/false, start: "...", end: "...", timezone: "..."})
agentAPI.config.set("communicationStyle", {<profile from step 6>})
agentAPI.config.set("connectedApps", [<apps from step 7>])
agentAPI.config.set("setupComplete", true)

# Create setup tasks
agentAPI.tasks.create({title: "Complete onboarding review", priority: "medium", tags: ["setup"]})
```

### Step 10 — Persist to AGENTS.md

Write the `## Agent Profile` section to `AGENTS.md` with all the collected information:

```markdown
## Agent Profile

### Function
<step 1 answer>

### Expectations
- <bullet 1>
- <bullet 2>
...

### Autonomy
**Autonomous:**
- <item>
**Needs confirmation:**
- <item>

### Notifications
- <channel>

### Availability
<active hours or 24/7>

### Communication Style
<step 6 profile or "Own persona">

### Connected Apps
- <app> — <login status>
```

### Step 11 — Wrap up

1. Tell the user setup is complete
2. Summarize the configuration
3. End the session: `agentAPI.session.end({summary: "Setup complete. Agent configured for <function>."})`
4. Ask if they want to start using the agent now

## Golden rules

- **One question at a time** — don't overwhelm the user
- **User's language** — detect from first message, respond in same language
- **No logins** — the agent never logs in. It opens the app and the user logs in.
- **No assumptions** — if the user's answer is ambiguous, ask for clarification
- **Save everything** — persist to both AGENTS.md (core) and agent-desk (config + session)
- **Respect privacy** — if the user declines an app or feature, skip it without pressure

## Post-setup

After setup, the agent should:
1. Read `AGENTS.md` on every session start to load its profile
2. Call `agentAPI.session.start()` at the beginning of each work session
3. Call `agentAPI.session.end()` at the end with a summary
4. Use `agent-desk` as its control center for tasks, events, and continuity
