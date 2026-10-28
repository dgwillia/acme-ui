# Claude Code instructions

@AGENTS.md

## Syncing tokens with Figma (agent-run)
Figma file: https://www.figma.com/design/5d9HHWsYninfYBCiPrWpEw

**Figma → code**
1. Run `sync/export-from-figma.figma.js` with the Figma MCP `use_figma` tool.
2. Save the returned `compact` object to `sync/figma-snapshot.json`.
3. `npm run tokens:from-figma` — verifies the checksum matches, then regenerates `/tokens`.
4. `npm run tokens:build && npm run design-md:build`, then open a PR.

**Code → Figma** (after a token PR is merged)
1. `npm run tokens:to-figma` — writes `sync/to-figma.json`, the minimal change set `sync/to-figma.diff.json`, and the checksum Figma should report afterwards.
2. Run `sync/import-to-figma.figma.js` with `use_figma`, replacing `__SNAPSHOT__` with the diff JSON.
3. Re-run the export checksum in Figma; it must equal the expected checksum. Then copy `sync/expected-figma-snapshot.json` to `sync/figma-snapshot.json`.
4. Report `changed`, `created` and anything listed in `onlyInFigma` (never deleted automatically).
