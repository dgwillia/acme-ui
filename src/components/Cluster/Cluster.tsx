import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Cluster.module.css';

export interface ClusterProps extends HTMLAttributes<HTMLElement> {
  /**
   * Space between children, horizontally and between wrapped rows.
   * - `compact` (8px): toolbars, tags, icon buttons.
   * - `default` (16px): button groups, filters.
   */
  gap?: 'compact' | 'default';
  /** HTML element to render. */
  as?: ElementType;
  children: ReactNode;
}

/**
 * Horizontal layout that wraps. Use for button groups, toolbars and tag lists.
 * Fills the available width; children keep their natural size.
 * Figma: "Primitives/Cluster" (gap = compact | default).
 */
export function Cluster({ gap = 'default', as: Tag = 'div', className, children, ...rest }: ClusterProps) {
  return (
    <Tag {...rest} className={[styles.cluster, styles[gap], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
