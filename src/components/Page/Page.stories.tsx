import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page } from './Page';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

const meta = {
  title: 'Layout/Page',
  component: Page,
  parameters: { layout: 'fullscreen' },
  args: {
    children: (
      <Stack gap="section">
        <Text variant="heading-medium" as="h1">Page title</Text>
        <Text tone="muted">Content is centred, max 960px wide, with page padding from space.2xl.</Text>
      </Stack>
    ),
  },
} satisfies Meta<typeof Page>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
