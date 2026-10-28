import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';
import { Stack } from '../Stack/Stack';

const meta = {
  title: 'Components/Text',
  component: Text,
  args: { children: 'Total emissions this quarter', variant: 'body-medium', tone: 'default' },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};
export const Heading: Story = { args: { variant: 'heading-medium' } };
export const Muted: Story = { args: { tone: 'muted' } };

/** Every style and tone, mirroring the Figma text styles. */
export const Scale: Story = {
  render: () => (
    <Stack gap="compact">
      <Text variant="heading-medium">Heading / Medium</Text>
      <Text variant="body-medium">Body / Medium</Text>
      <Text variant="label-large">Label / Large</Text>
      <Text variant="label-medium">Label / Medium</Text>
      <Text variant="label-small">Label / Small</Text>
      <Text tone="muted">Muted</Text>
      <Text tone="critical">Critical</Text>
      <Text tone="success">Success</Text>
      <Text tone="warning">Warning</Text>
      <Text tone="info">Info</Text>
    </Stack>
  ),
};
