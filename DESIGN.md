---
<!-- tokens:start — generated from /tokens by scripts/build-design-md.mjs. Do not edit by hand. -->
colors:
  surface-default: { light: "#ffffff", dark: "#020617" }
  surface-raised: { light: "#ffffff", dark: "#0f172a" }
  surface-subtle: { light: "#f1f5f9", dark: "#1e293b" }
  surface-interactive: { light: "#1d4ed8", dark: "#60a5fa" }
  surface-interactive-hover: { light: "#1e40af", dark: "#93c5fd" }
  surface-critical: { light: "#dc2626", dark: "#ef4444" }
  surface-critical-hover: { light: "#b91c1c", dark: "#f87171" }
  surface-disabled: { light: "#f1f5f9", dark: "#1e293b" }
  surface-critical-subtle: { light: "#fef2f2", dark: "#450a0a" }
  surface-warning-subtle: { light: "#fffbeb", dark: "#451a03" }
  surface-success-subtle: { light: "#f0fdf4", dark: "#052e16" }
  surface-info-subtle: { light: "#eff6ff", dark: "#172554" }
  text-default: { light: "#0f172a", dark: "#f8fafc" }
  text-muted: { light: "#475569", dark: "#94a3b8" }
  text-on-interactive: { light: "#ffffff", dark: "#020617" }
  text-interactive: { light: "#1d4ed8", dark: "#93c5fd" }
  text-disabled: { light: "#94a3b8", dark: "#475569" }
  text-critical: { light: "#b91c1c", dark: "#f87171" }
  text-warning: { light: "#92400e", dark: "#fcd34d" }
  text-success: { light: "#15803d", dark: "#4ade80" }
  text-info: { light: "#1d4ed8", dark: "#93c5fd" }
  icon-default: { light: "#334155", dark: "#cbd5e1" }
  icon-on-interactive: { light: "#ffffff", dark: "#020617" }
  border-default: { light: "#e2e8f0", dark: "#334155" }
  border-strong: { light: "#94a3b8", dark: "#64748b" }
  border-focus: { light: "#2563eb", dark: "#60a5fa" }
  border-critical: { light: "#dc2626", dark: "#f87171" }
  data-measured: { light: "#047857", dark: "#34d399" }
  data-estimated: { light: "#6ee7b7", dark: "#047857" }
  data-modelled: { light: "#60a5fa", dark: "#60a5fa" }
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  compact: 8px
  default: 16px
  section: 32px
radius:
  control: 9999px
  container: 16px
  pill: 9999px
typography:
  label-small: { family: "Inter", weight: 600, size: 12px, line-height: 16px }
  label-medium: { family: "Inter", weight: 600, size: 14px, line-height: 20px }
  label-large: { family: "Inter", weight: 600, size: 16px, line-height: 24px }
  body-medium: { family: "Inter", weight: 400, size: 14px, line-height: 20px }
  heading-medium: { family: "Inter", weight: 600, size: 20px, line-height: 28px }
<!-- tokens:end -->
---

# Acme UI design system

The brief for anyone, person or agent, building interfaces with `@acme/ui`.
The token section above and the table below are **generated** from `/tokens`
(which are synced from Figma). Everything else is written by the design team.

## Visual theme

Calm, precise, evidence-first. Dense but never cramped: analysts scan, executives skim.
Emerald is the brand colour and signals action. It is never decoration.

## Building blocks

- **Layout:** `Page` (outer container), `Stack` (vertical) and `Cluster` (horizontal, wraps). Their `gap` is the
  only way spacing is applied between elements.
- **Text:** `Text` with a `variant` (heading-medium, body-medium, label-*) and a `tone`.
- **Containers:** `Card` for a raised group of related content.
- **Actions:** `Button` (primary, secondary, ghost).

## Hierarchy

- One primary Button per view. Secondary for alternatives, ghost inside cards and tables.
- Numbers are the hero; labels support them. Use `label-small` + `muted` for captions.
- `space.section` between page sections, `space.default` inside a group,
  `space.compact` for tightly related items.

## Data and uncertainty (non-negotiable)

- Never show an estimated value styled as if it were measured.
- `color.data.estimated` must always be paired with a label or pattern, never colour alone.
- Always state the unit and the period ("1,240 tCO2e · Q3").

## Voice

Plain English. Sentence case. Buttons say what happens ("Save changes", "Request data"),
never "OK" or "Submit". No exclamation marks.

## Don'ts

- No raw hex values, pixel values or font names in code. Lint will fail.
- No inline `style` attributes. No hand-written margins.
- No new components inside feature code. If the system is missing something, say so.
- Never import component internals; import from `@acme/ui` only.

## Tokens

<!-- table:start -->
| Token (CSS) | Light | Dark | Use for |
|---|---|---|---|
| `var(--color-surface-default)` | #ffffff | #020617 | Page background. |
| `var(--color-surface-raised)` | #ffffff | #0f172a | Cards, panels and anything above the page. |
| `var(--color-surface-subtle)` | #f1f5f9 | #1e293b | Quiet backgrounds and hover state for secondary and ghost controls. |
| `var(--color-surface-interactive)` | #1d4ed8 | #60a5fa | Primary action background. One primary action per view. |
| `var(--color-surface-interactive-hover)` | #1e40af | #93c5fd | Hover and pressed state of the primary action. |
| `var(--color-surface-critical)` | #dc2626 | #ef4444 | Destructive action background. |
| `var(--color-surface-critical-hover)` | #b91c1c | #f87171 | Hover state of destructive actions. |
| `var(--color-surface-disabled)` | #f1f5f9 | #1e293b | Disabled controls. |
| `var(--color-surface-critical-subtle)` | #fef2f2 | #450a0a | Error message backgrounds. |
| `var(--color-surface-warning-subtle)` | #fffbeb | #451a03 | Warning message backgrounds. |
| `var(--color-surface-success-subtle)` | #f0fdf4 | #052e16 | Success message backgrounds. |
| `var(--color-surface-info-subtle)` | #eff6ff | #172554 | Informational message backgrounds. |
| `var(--color-text-default)` | #0f172a | #f8fafc | Body and heading text. |
| `var(--color-text-muted)` | #475569 | #94a3b8 | Secondary text, table headers, help text. |
| `var(--color-text-on-interactive)` | #ffffff | #020617 | Text on primary and critical action surfaces. |
| `var(--color-text-interactive)` | #1d4ed8 | #93c5fd | Links and ghost button labels. |
| `var(--color-text-disabled)` | #94a3b8 | #475569 | Disabled control text. |
| `var(--color-text-critical)` | #b91c1c | #f87171 | Error text and destructive ghost labels. |
| `var(--color-text-warning)` | #92400e | #fcd34d | Warning text. |
| `var(--color-text-success)` | #15803d | #4ade80 | Success text. |
| `var(--color-text-info)` | #1d4ed8 | #93c5fd | Informational text. |
| `var(--color-icon-default)` | #334155 | #cbd5e1 | Default icon colour. |
| `var(--color-icon-on-interactive)` | #ffffff | #020617 | Icons on primary and critical surfaces. |
| `var(--color-border-default)` | #e2e8f0 | #334155 | Dividers, card and input borders. |
| `var(--color-border-strong)` | #94a3b8 | #64748b | Secondary button and emphasised borders. |
| `var(--color-border-focus)` | #2563eb | #60a5fa | Keyboard focus ring. |
| `var(--color-border-critical)` | #dc2626 | #f87171 | Error state borders. |
| `var(--color-data-measured)` | #047857 | #34d399 | Values from metered or primary data. Never use for estimates. |
| `var(--color-data-estimated)` | #6ee7b7 | #047857 | Values from averages, proxies or estimates. Pair with pattern or label, not colour alone. |
| `var(--color-data-modelled)` | #60a5fa | #60a5fa | Forecasts and scenarios. |
| `var(--space-xs)` | 4px | 4px |  |
| `var(--space-sm)` | 8px | 8px |  |
| `var(--space-md)` | 12px | 12px |  |
| `var(--space-lg)` | 16px | 16px |  |
| `var(--space-xl)` | 24px | 24px |  |
| `var(--space-2xl)` | 32px | 32px |  |
| `var(--space-3xl)` | 48px | 48px |  |
| `var(--space-compact)` | 8px | 8px | Layout gap for tightly related items: toolbars, field groups. |
| `var(--space-default)` | 16px | 16px | Default layout gap between items in a Stack or Cluster. |
| `var(--space-section)` | 32px | 32px | Gap between page sections. |
| `var(--radius-control)` | 9999px | 9999px | Buttons, inputs, selects. Fully rounded (pill) controls. |
| `var(--radius-container)` | 16px | 16px | Cards, dialogs, panels. |
| `var(--radius-pill)` | 9999px | 9999px | Badges and tags. |
<!-- table:end -->
