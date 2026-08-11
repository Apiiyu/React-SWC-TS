// Tailwind entry — without this, stories render completely unstyled

import '../src/index.css';
// vite-plugin-svg-icons sprite — without this, AppBaseSvg stories render an empty icon
import 'virtual:svg-icons-register';
// i18n — components using `useTranslation`/`i18n.t` need this initialized
import '../src/plugins/i18n/i18n';

// Storybook
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // Fail browser verification instead of hiding accessibility regressions.
      test: 'error',
    },
  },
};

export default preview;
