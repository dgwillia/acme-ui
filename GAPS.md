# Gaps

What Figma and code can't express the same way, what needs a human to check, and what the system
is still missing. Agents: read this before reporting a difference as a bug. Add to it when you find
something new, in the same PR as the work that found it.

Source of truth: **tokens, Figma leads. Components, code leads** (see `AGENTS.md`).

## 1. Expected differences between Figma and code
These are by design. The parity check (`npm run parity`) treats them as expected via
`sync/parity.config.json`; keep the two lists in step.

| What | In code | In Figma | Why |
|---|---|---|---|
| Stack, Cluster | Components | Auto layout frames named "Stack gap=…" / "Cluster gap=…", gap bound to a space token | Figma auto layout already does this; a component wrapper adds clicks for nothing |
| Text | Component with `variant` and `tone` | Text styles of the same name + text colour variables | Figma styles text with styles, not components |
| `as` prop (Card, Stack, Cluster, Text) | Picks the HTML element (`section`, `ul`, `h2`) | Nothing | Semantics only; invisible in a design |
| Button `type` | `button` or `submit` | Nothing | Behaviour only |
| `children` | Any content | Text property `label` (Button, Badge) or slot `content` (Card, Page) | Figma needs to know the shape of what goes inside |
| Icons (`leadingIcon`) | Any React node | Boolean `hasLeadingIcon` + instance swap `leadingIcon` | Figma shows/hides and swaps instances; it can't take an empty node |
| Button and Badge text property | One label per instance | Shared default across all variants | Figma text properties apply to the whole component set |
| Ghost button's 1px border | `border: … transparent` | Unbound stroke at 0% opacity, counted in layout | A colour-bound stroke draws at full strength even at 0% opacity in Figma |

## 2. Things only code can show (check in Storybook, not Figma)
- **Focus, hover and pressed states.** The Figma Button shows default and disabled only; hover, pressed, focus rings and keyboard order exist only in code.
- **Loading behaviour** (Button `loading` blocks clicks and keeps the label).
- **Screen reader output**: labels, roles, what's announced. Checked by the Storybook a11y addon.
- **Text wrapping and truncation** with real data lengths.
- **Font rendering**: Figma and the browser differ by about 1px in text width. Not a bug.

## 3. Needs a human check
- **Meaning, not syntax.** TypeScript allows any `tone`; only review catches `info` used for something overdue. Rules: DESIGN.md, Status section.
- **Label wording.** Sentence case, makes sense on its own ("Estimated data", not "Estimated").
- **Visual match.** The parity check compares props, not pixels. After a visual change, compare a Storybook screenshot with the Figma component.

## 4. Open system gaps
| Gap | Found by | Next step |
|---|---|---|
| No List / ListItem or divider | Agent, Home screen in Figma | Spec a List component |
| No Meter or chart (measured vs estimated split) | Agent, Home screen | Spec a Meter using `color.data.*` |
| Ghost buttons in lists look indented | PR #1, Home screen | Decide: flush-left rule or a link-style variant |
| No grid or columns layout | Agent, Home screen | Wait until a screen needs two columns |
| No date and time format rule | Agent, Home screen | Add to DESIGN.md ("Today, 08:12", "Mon 26 Oct") |
| Interim rule "info is not next to actions" now outdated (info is violet) | PR #10 | Relax it in DESIGN.md |
| Code Connect not published (needs a Figma Organization plan) | PR #7 | Template ready in `figma/Badge.figma.ts` |
| Figma component manifest is exported by hand, so CI only sees Figma as of the last export | Parity check | Run the export in every component PR; automate with the Figma REST API on an Enterprise plan |
| Figma changes made without an export go unnoticed (tokens and components) | Sync design | Scheduled agent export, or Enterprise REST API |

**Closed:** token sync status in CI (`npm run figma:sync-status`); Figma descriptions generated from code (`npm run figma:descriptions`).
