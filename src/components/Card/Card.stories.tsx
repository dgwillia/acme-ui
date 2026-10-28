import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Cluster } from '../Cluster/Cluster';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    children: (
      <Stack gap="default">
        <Text variant="heading-medium">Northfield Steel</Text>
        <Text tone="muted">Metals · 1,240 tCO2e this quarter</Text>
        <Cluster gap="compact">
          <Button size="sm">Request data</Button>
          <Button size="sm" variant="ghost">View supplier</Button>
        </Cluster>
      </Stack>
    ),
  },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = {
  args: { children: <Text tone="muted">No suppliers yet. Add one to see its emissions here.</Text> },
};
