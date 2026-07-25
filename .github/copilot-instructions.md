# GitHub Copilot — Nexus Frontend

Repository-wide Copilot adapter. Architecture lives in `AGENTS.md`; workflows live in `.agents/skills/`.

- Always follow `AGENTS.md`.
- Prefer path-specific files under `.github/instructions/` for scoped guidance.
- Use `.github/prompts/` for repeatable batch workflows.
- Use `.github/agents/` specialist agents when the task matches their description.
- Do not duplicate long architecture instructions in Copilot files.
- Do not configure Figma OAuth or personal MCP credentials in this repository.
- Do not commit or push unless explicitly requested.
