import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cluster } from './Cluster';
import { Button } from '../Button/Button';

const meta = {
  title: 'Layout/Cluster',
  component: Cluster,
  args: {
    gap: 'default',
    children: (
      <>
        <Button>Save changes</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="ghost">View details</Button>
      </>
    ),
  },
} satisfies Meta<typeof Cluster>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { gap: 'compact' } };
/** Wraps onto new rows when space runs out. */
export const Wrapping: Story = {
  decorators: [Story => <div style={{ width: 280 }}><Story /></div>], // eslint-disable-line no-restricted-syntax -- demo container only
};
