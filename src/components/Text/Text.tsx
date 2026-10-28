import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Text.module.css';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /**
   * Typographic style, mirroring the Figma text styles.
   * - `heading-medium`: section and card titles.
   * - `body-medium`: body copy and descriptions.
   * - `label-small` | `label-medium` | `label-large`: labels, captions, column headers.
   */
  variant?: 'heading-medium' | 'body-medium' | 'label-small' | 'label-medium' | 'label-large';
  /** Colour role. `muted` for secondary text; status tones only for status messages. */
  tone?: 'default' | 'muted' | 'critical' | 'success' | 'warning' | 'info';
  /** HTML element. Defaults to `h2` for headings, `p` otherwise. Choose the right level for the page outline. */
  as?: ElementType;
  children: ReactNode;
}

/**
 * All text. Never set font size, weight or colour by hand.
 * Figma: text styles Heading/Medium, Body/Medium, Label/Small|Medium|Large.
 */
export function Text({ variant = 'body-medium', tone = 'default', as, className, children, ...rest }: TextProps) {
  const Tag = as ?? (variant.startsWith('heading') ? 'h2' : 'p');
  return (
    <Tag {...rest} className={[styles.text, styles[variant], styles[tone], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
