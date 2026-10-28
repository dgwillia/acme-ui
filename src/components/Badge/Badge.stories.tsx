import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Cluster } from '../Cluster/Cluster';

const ClockIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M8 5v3l2 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Draft', tone: 'neutral' },
  argTypes: { leadingIcon: { control: false } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Default tone for anything without a status meaning. */
export const Neutral: Story = {};
/** In progress or informational. */
export const Info: Story = { args: { tone: 'info', children: 'Awaiting reply' } };
/** Done or verified. */
export const Success: Story = { args: { tone: 'success', children: 'Received' } };
/** Needs attention soon. */
export const Warning: Story = { args: { tone: 'warning', children: 'Due soon' } };
/** Overdue, failed or blocked. */
export const Critical: Story = { args: { tone: 'critical', children: 'Overdue' } };
/** Optional decorative icon before the label. */
export const WithIcon: Story = { args: { tone: 'warning', children: 'Due soon', leadingIcon: <ClockIcon /> } };

/** All tones side by side. Compare with the Figma "Badge" component set. */
export const AllTones: Story = {
  render: args => (
    <Cluster gap="compact">
      <Badge {...args} tone="neutral">Draft</Badge>
      <Badge {...args} tone="info">Awaiting reply</Badge>
      <Badge {...args} tone="success">Received</Badge>
      <Badge {...args} tone="warning">Due soon</Badge>
      <Badge {...args} tone="critical">Overdue</Badge>
    </Cluster>
  ),
};
