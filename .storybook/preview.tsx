import type { Preview } from "@storybook/react-vite";

// Tailwind entry — without this, stories render completely unstyled
import "../src/index.css";

// vite-plugin-svg-icons sprite — without this, AppBaseSvg stories render an empty icon
import "virtual:svg-icons-register";

// i18n — components using `useTranslation`/`i18n.t` need this initialized
import "../src/plugins/i18n/i18n";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
