import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
  },
  // Charts default to width:'auto', so give every story a bounded container.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 680, fontFamily: 'system-ui, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
