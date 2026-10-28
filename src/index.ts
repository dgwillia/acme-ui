// @acme/ui — the only entry point screens and agents import from.
// Load the brand font so every machine (and CI screenshots) renders Inter, as Figma does.
// Only the weights our text styles use: 400 (Body) and 600 (Label, Heading).
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import './styles/tokens.css';
import './styles/base.css';

export { Button } from './components/Button/Button';
export type { ButtonProps } from './components/Button/Button';
export { Stack } from './components/Stack/Stack';
export type { StackProps } from './components/Stack/Stack';
export { Cluster } from './components/Cluster/Cluster';
export type { ClusterProps } from './components/Cluster/Cluster';
export { Text } from './components/Text/Text';
export type { TextProps } from './components/Text/Text';
export { Card } from './components/Card/Card';
export type { CardProps } from './components/Card/Card';
export { Page } from './components/Page/Page';
export type { PageProps } from './components/Page/Page';
export { Badge } from './components/Badge/Badge';
export type { BadgeProps } from './components/Badge/Badge';
