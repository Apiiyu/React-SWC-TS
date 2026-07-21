import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppBaseErrorBoundary } from "./AppBaseErrorBoundary";

const ThrowingChild = () => {
  throw new Error("Simulated render error");
};

const meta = {
  title: "app/base/AppBaseErrorBoundary",
  component: AppBaseErrorBoundary,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Catches render errors from its children, dispatches a toast via the same event bus `plugins/errorHandler` uses, and shows a retry fallback instead of a blank screen.",
      },
    },
  },
} satisfies Meta<typeof AppBaseErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoError: Story = {
  args: {
    children: <div>Everything is fine.</div>,
  },
};

export const CaughtError: Story = {
  args: {
    children: <ThrowingChild />,
  },
};
