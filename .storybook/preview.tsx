import type { Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/base.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Semantic token mode',
      toolbar: { title: 'Theme', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, ctx) => {
      document.documentElement.dataset.theme = ctx.globals.theme;
      return <Story />;
    },
  ],
  parameters: { a11y: { test: 'error' } },
  tags: ['autodocs'],
};
export default preview;
