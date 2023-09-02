import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import LogoBar from "./logo-bar";
import { MemoryRouter } from "react-router-dom";

const meta = {
  component: LogoBar,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof LogoBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
