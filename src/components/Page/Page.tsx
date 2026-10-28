import type { ReactNode } from 'react';
import styles from './Page.module.css';

export interface PageProps {
  /** Page content. Usually a Stack with gap="section". */
  children: ReactNode;
}

/**
 * Outer page container: centres content to a readable width and applies page padding
 * (space.2xl). Every screen starts with one Page.
 * Figma: "Page" component with a `content` slot (= children). Max width 960, space.2xl padding.
 * Added after the first agent build reported it as a gap in the system.
 */
export function Page({ children }: PageProps) {
  return <main className={styles.page}>{children}</main>;
}
