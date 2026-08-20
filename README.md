# Assistant

A ready-to-use workspace for your AI coding agent. Clone this repository, launch your agent inside it, and ask it to help with your routine tasks.

## What is this?

This repo is a lightweight, opinionated starting point for working with an AI agent on your everyday work. It ships with a set of curated skills and conventions so your agent has the right context from the very first message.

## How to use it

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-user>/assistant.git
   cd assistant
   ```

2. **Launch your agent inside the repo**

   ```bash
   ./agent
   ```

   This runs the agent web UI on `http://127.0.0.1:10000`. Then open the project in your agent of choice (Devin CLI, Claude Code, Cursor, etc.) and start a session from this directory.

3. **Ask it to help with your routine tasks**

   That's it. Describe what you need — refactoring, tests, research, scaffolding, reviews — and the agent will use the bundled skills and conventions to assist you.

## What's inside

- `LICENSE` — open source license.
- `.agents/` — agent skills and configuration.
- `skills-lock.json` — pinned skill versions for reproducible setups.

## License

See [LICENSE](./LICENSE) for details.
