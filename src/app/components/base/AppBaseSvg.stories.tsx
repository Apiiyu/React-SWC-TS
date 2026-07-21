import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppBaseSvg } from "./AppBaseSvg";

const meta = {
  title: "app/base/AppBaseSvg",
  component: AppBaseSvg,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
  },
} satisfies Meta<typeof AppBaseSvg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "icon-checkmark",
  },
};

export const CustomColor: Story = {
  args: {
    name: "icon-checkmark",
    color: "#0ddb93",
  },
};
