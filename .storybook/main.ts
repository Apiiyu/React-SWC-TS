// Storybook
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => ({
    ...config,
    build: {
      ...config.build,
      // Storybook's documentation and accessibility vendor chunks are intentionally large.
      chunkSizeWarningLimit: 2048,
    },
  }),
};
export default config;
