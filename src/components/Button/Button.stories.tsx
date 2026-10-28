import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Cluster } from '../Cluster/Cluster';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Save changes', variant: 'primary', size: 'md' },
  argTypes: { leadingIcon: { control: false } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The single most important action in a view. */
export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'View details' } };
export const WithIcon: Story = { args: { leadingIcon: <PlusIcon />, children: 'Add supplier' } };
/** Async action in progress: spinner shown, clicks blocked, label kept. */
export const Loading: Story = { args: { loading: true, children: 'Saving' } };
export const Disabled: Story = { args: { disabled: true } };
export const SecondaryDisabled: Story = { args: { variant: 'secondary', disabled: true, children: 'Cancel' } };
export const LongLabel: Story = { args: { children: 'Export emissions report for all sites' } };

/** All sizes side by side. */
export const Sizes: Story = {
  render: args => (
    <Cluster gap="default">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </Cluster>
  ),
};
