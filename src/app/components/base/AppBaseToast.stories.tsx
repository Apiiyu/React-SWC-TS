import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppBaseToast } from "./AppBaseToast";
import { ToastPosition, ToastType } from "@/app/constants/toast.constant";
import eventBus from "@/plugins/mitt/mitt";

const meta = {
  title: "app/base/AppBaseToast",
  component: AppBaseToast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Listens on the `mitt` event bus for a `"toast"` event — renders nothing until one fires. These stories dispatch a real event in `play()` to exercise the actual pipeline used by `plugins/errorHandler`.',
      },
    },
  },
} satisfies Meta<typeof AppBaseToast>;

export default meta;
type Story = StoryObj<typeof meta>;

interface IToastPayload {
  isOpen: boolean;
  message: string;
  type: ToastType;
  position: ToastPosition;
}

const emitToast = (overrides: Partial<IToastPayload>) =>
  eventBus.emit("toast", {
    isOpen: true,
    message: "Something happened",
    type: ToastType.SUCCESS,
    position: ToastPosition.TOP_RIGHT,
    ...overrides,
  });

export const Hidden: Story = {
  name: "No event yet (hidden)",
};

export const Success: Story = {
  play: async () => {
    emitToast({ type: ToastType.SUCCESS, message: "Saved successfully" });
  },
};

export const Danger: Story = {
  play: async () => {
    emitToast({ type: ToastType.DANGER, message: "Something went wrong" });
  },
};

export const Warning: Story = {
  play: async () => {
    emitToast({ type: ToastType.WARNING, message: "Check your input" });
  },
};
