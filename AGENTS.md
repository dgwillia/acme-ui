# Working in acme-ui (for any AI coding agent)

This repo is the Acme design system (`@acme/ui`) plus a demo app.
Tokens are synced from Figma; components mirror the Figma library one to one.

## Before any UI work
1. Read `DESIGN.md` (rules, rationale and the token table).
2. Use the **Storybook MCP** tools (`docs-list`, `docs-show`) to find components and their
   documented props. Storybook must be running: `npm run storybook`.
3. If given a Figma link, use the **Figma MCP** (`get_design_context`) and prefer the
   components it names over building new markup.

## Hard rules
- Never hallucinate component props. If a prop is not in the Storybook docs, it does not exist.
  Ask, or propose the change to the system in a separate pull request.
- Build screens only from `@acme/ui` exports: `Page`, `Stack`, `Cluster`, `Text`, `Card`, `Button`.
  Import from the package entry (`src/index.ts`), never from component internals.
- All layout uses `Stack` or `Cluster`. No margins, no inline `style`, no ad-hoc flex containers.
- No raw colours, spacing, radii or font values anywhere. Lint enforces this.
- Never edit generated files: `src/styles/tokens.css`, the token sections of `DESIGN.md`, `/tokens`
  (tokens change in Figma, or via a reviewed PR to `/tokens`).
- If the system lacks something you need, stop and report the gap in your PR description.

## When finished
Run `npm run check` (rebuilds tokens and DESIGN.md, then lint and type check).
List the components you used in the PR description.
