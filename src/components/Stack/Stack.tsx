import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Stack.module.css';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /**
   * Space between children.
   * - `compact` (8px, space.compact): tightly related items, e.g. a label and its field.
   * - `default` (16px, space.default): items in a group.
   * - `section` (32px, space.section): between page sections.
   */
  gap?: 'compact' | 'default' | 'section';
  /** HTML element to render, e.g. `section`, `form`, `ul`. */
  as?: ElementType;
  children: ReactNode;
}

/**
 * Vertical layout. All vertical spacing goes through Stack: no hand-written margins.
 * Figma: no component. Use a vertical auto layout frame with gap bound to space/compact|default|section,
 * named "Stack gap=…".
 */
export function Stack({ gap = 'default', as: Tag = 'div', className, children, ...rest }: StackProps) {
  return (
    <Tag {...rest} className={[styles.stack, styles[gap], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
