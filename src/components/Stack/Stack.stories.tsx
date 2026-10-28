import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';
import { Text } from '../Text/Text';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: {
    gap: 'default',
    children: (
      <>
        <Text variant="heading-medium">Supplier overview</Text>
        <Text tone="muted">Stack spaces its children with a token. No margins needed.</Text>
        <Text>Third item</Text>
      </>
    ),
  },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = { args: { gap: 'compact' } };
export const Default: Story = {};
export const Section: Story = { args: { gap: 'section' } };
