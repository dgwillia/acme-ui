# Acme UI — AI-ready design system proof of concept

Figma variables → DTCG tokens → CSS variables → React components → Storybook (+ MCP) → agent-built screens,
with two-way token sync between Figma and code.

| Folder / file | What it is |
|---|---|
| `tokens/` | DTCG token files: the source of truth in code (synced from Figma) |
| `sync/` | Figma ⇄ code sync: scripts that run inside Figma via the Figma MCP, plus converters |
| `style-dictionary.config.mjs` | Builds `src/styles/tokens.css` (light on `:root`, dark on `[data-theme="dark"]`) |
| `src/components/` | Page, Stack, Cluster, Text, Card, Button: token-only styling, JSDoc, stories |
| `src/demo/` | A screen built by an AI agent using only `@acme/ui` |
| `DESIGN.md` | Design brief for agents; token section generated from `/tokens` |
| `AGENTS.md` / `CLAUDE.md` | Rules agents must follow, and how to run the Figma sync |
| `.mcp.json` | Figma MCP + Storybook MCP for Claude Code |

## Commands
```bash
npm install
npm run storybook        # component docs + Storybook MCP at http://localhost:6006/mcp
npm run dev              # the demo screen
npm run check            # what CI runs: rebuild tokens + DESIGN.md, fail if stale, lint, types
```

Figma file: https://www.figma.com/design/5d9HHWsYninfYBCiPrWpEw
