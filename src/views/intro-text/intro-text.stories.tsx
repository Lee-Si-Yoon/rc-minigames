import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import IntroText, { TextSequence } from "./intro-text";

const meta = {
  component: IntroText,
} satisfies Meta<typeof IntroText>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockData: TextSequence[] = [
  {
    text: "READY",
    fps: 21,
    duration: 30,
    minSize: 24,
    maxSize: 48,
  },
  {
    text: "GO!",
    fps: 21,
    duration: 12,
    minSize: 52,
    maxSize: 64,
  },
  {
    text: "",
    duration: 100,
  },
];

export const Primary: Story = {
  argTypes: {
    backgroundColor: {
      controls: "string",
    },
  },
  args: {
    data: mockData,
    width: 500,
    height: 300,
    backgroundColor: "black",
  },
};
