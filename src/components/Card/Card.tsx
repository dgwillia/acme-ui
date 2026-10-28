import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** HTML element, e.g. `section` or `article`. */
  as?: ElementType;
  /** Content. Put a Stack inside to space it. */
  children: ReactNode;
}

/**
 * A raised container for a group of related content.
 * Slot contract: children should be a Stack (or Text, Cluster, Button).
 * Figma: "Card" (raised surface, default border, radius.container, space.xl padding).
 */
export function Card({ as: Tag = 'section', className, children, ...rest }: CardProps) {
  return (
    <Tag {...rest} className={[styles.card, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
