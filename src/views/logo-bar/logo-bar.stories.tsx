import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import LogoBar from './logo-bar';

const meta = {
  component: LogoBar,
  decorators: [
    (Story) => {
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof LogoBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
