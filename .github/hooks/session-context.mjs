#!/usr/bin/env node
/**
 * Lightweight Copilot session context — no expensive repository commands.
 */
const payload = {
  additionalContext:
    "Follow AGENTS.md and .agents/skills/. Do not commit secrets. Do not run expensive gates in hooks.",
};

process.stdout.write(JSON.stringify(payload));
