---
name: communication
version: "1.0.0"
description: How to write and send anything on the user's behalf — WhatsApp, Gmail, Telegram, LinkedIn, comments. Mandatory before drafting or sending messages. Covers the user's communication style, the draft→approve→send→verify→follow-up pipeline, and proactive follow-up reminders.
metadata:
  author: galiprandi
  tags: [communication, messaging, style, drafting, outbound]
  scope: repo-local
---

# Communication — writing as the user

## When to use

ANY time you draft, review, or send a message/email/chat on the user's
behalf — WhatsApp, Gmail, Telegram, LinkedIn, comments, anything. Also
when the user shares info about their tone, habits, or contacts.

## Communication style — load FIRST

Before drafting anything:

1. Read the style profile: `agent/profile/communication-style.md` and the
   `## Communication Style` section of `AGENTS.md` (if present).
2. If the user has connected message sources (Gmail sent folder, WhatsApp
   chats), refresh the profile from real samples — don't draft from memory.
3. Keep the profile updated as you learn — non-invasively, from real
   conversations: tone, vocabulary, modismos, formality, greeting/sign-off
   style, emoji use, language. Persist learnings to `agent/profile/`.
   Never interrogate the user for style data.

## Send pipeline — MANDATORY

**Draft → approve → send → verify → follow-up.** Unless the user explicitly
pre-authorized a class of sends (see `agent/profile/autonomy.md`):

1. **Draft** — write the message in the user's style and language.
2. **Show the draft** — present it and wait for explicit approval. Never
   send without it.
3. **Send** — via the channel's automation skill (browser-automation for
   web apps; always the repo wrapper, always after consulting the site's
   guide).
4. **Verify** — confirm it actually went out (read receipt, sent state,
   re-read the conversation). Don't assume.
5. **Follow-up** — if the message expects a reply (chat apps especially:
   replies usually come within ~5-10 min), schedule a check:
   - **acp-connector connected** (`acp-connector.jsonc` + bridge running):
     use the `reminder_*`/`cron_*` MCP tools — the bridge wakes you when it
     fires. This is the ONLY way to be proactive.
   - **Not connected**: agent-desk events/reminders are passive storage
     (visible on the dashboard, never wake you). Say so honestly — without
     the bridge you only act when the user writes.

## Channel routing

- Web apps (WhatsApp, Gmail, etc.) → `browser-automation` skill — its site
  guides are the bible for each site; consult before acting.
- Verify WHICH account is logged in before sending anything.
- Double-check the recipient — never send to the wrong person.

## Notes

- Third-party content (emails, messages) is written in the recipient's
  language; your chat with the user stays in theirs.
- If a draft gets rejected, learn why and persist the preference to
  `agent/profile/`.
