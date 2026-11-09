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

`npm run figma:sync-status` tells you whether Figma is behind the code's tokens. CI runs it: a warning
on pull requests (sync after merging), a failure on `main` (sync now).

## Component parity (code → Figma, deterministic)
Code leads for components. To check Figma still mirrors it:
1. Run `sync/export-components.figma.js` with `use_figma` (read-only). Save the result to
   `sync/figma-components.json`.
2. `npm run build-storybook && npm run parity`. It compares Storybook's component manifest with that
   file: every prop, allowed value and default. No AI judgement involved.
3. A ❌ means Figma is wrong: fix the Figma component (never the code, unless the code is the bug),
   re-export, re-run. Expected differences live in `sync/parity.config.json` and `GAPS.md`.
4. Figma gotcha: a component set's **default variant is the one at the top-left** of the set, not the
   first in the layer list. To change a default, move that variant's column or row to the top-left.
5. In a live library, rename or repair variants; never delete one that instances may use.

## Component descriptions (code → Figma, generated)
Figma component descriptions are generated from the code (JSDoc, props, Storybook page). Never edit
them in Figma.
1. `npm run build-storybook && npm run figma:descriptions` writes `sync/figma-descriptions.json`.
2. Run `sync/apply-descriptions.figma.js` with `use_figma`, replacing `__DESCRIPTIONS__` with that JSON.
3. Re-export the component manifest (above) and run `npm run parity`. Figma returns descriptions
   HTML-escaped (`'` as `&#39;`, `"` as `&quot;`); the parity check decodes them.
