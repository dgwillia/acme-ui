import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Meaning of the status. One tone per meaning, used consistently:
   * - `neutral`: everything else (draft, not started, n/a).
   * - `info`: in progress or informational (awaiting reply).
   * - `success`: done or verified (received, measured).
   * - `warning`: needs attention soon (due soon, estimated).
   * - `critical`: overdue, failed or blocked.
   */
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'critical';
  /** Optional icon shown before the label. Sized to the text (12px). Decorative only. */
  leadingIcon?: ReactNode;
  /** The label. Always required: colour is never the only signal. Sentence case, one or two words. */
  children: ReactNode;
}

/**
 * A short, non-interactive status label, e.g. "Overdue" or "Received".
 * Do NOT use as a button or link, and never without a text label.
 *
 * Adapted from shadcn/ui's Badge (MIT): same structure and icon slot,
 * restyled with Acme tokens. shadcn's secondary, outline, ghost and link
 * variants and the render-as-link option are intentionally not included.
 *
 * Figma: "Badge" component set (tone; label, leadingIcon).
 * Tokens: color.surface.*-subtle, color.surface.subtle, color.text.*,
 * radius.pill, space.2xs, space.sm, space.xs, font.label-small.
 */
export function Badge({ tone = 'neutral', leadingIcon, className, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')}>
      {leadingIcon && <span className={styles.icon} aria-hidden="true">{leadingIcon}</span>}
      {children}
    </span>
  );
}
