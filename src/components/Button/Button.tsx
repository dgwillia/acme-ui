import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Visual emphasis.
   * - `primary`: the single most important action in a view. Max one per view.
   * - `secondary`: other actions, e.g. Cancel.
   * - `ghost`: low-emphasis actions inside tables, cards and toolbars.
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Control size. `md` is the default; `sm` for dense tables and toolbars; `lg` for hero actions. */
  size?: 'sm' | 'md' | 'lg';
  /** Prevents interaction and shows the disabled style. Prefer explaining why nearby. */
  disabled?: boolean;
  /** Shows a spinner and blocks clicks while an async action runs. Keep a label such as "Saving". */
  loading?: boolean;
  /** Optional icon shown before the label. */
  leadingIcon?: ReactNode;
  /** The label. Say what happens ("Save changes"), not "OK". */
  children: ReactNode;
}

/**
 * Triggers an action. Use for the actions on a page or in a form.
 * Do NOT use for navigation: use a link.
 *
 * Figma: "Button" component set (variant × size × disabled; label, loading, leadingIcon).
 * Tokens: color.surface.interactive, color.text.on-interactive, color.border.strong,
 * radius.control, border-width.default, space.*, font.label-*.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leadingIcon,
  children,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  return (
    <button
      {...rest}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-disabled={disabled || undefined}
    >
      {loading && <Spinner />}
      {!loading && leadingIcon && <span className={styles.icon} aria-hidden="true">{leadingIcon}</span>}
      <span>{children}</span>
    </button>
  );
}

function Spinner() {
  return (
    <svg className={styles.spinner} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="9" strokeLinecap="round" />
    </svg>
  );
}
