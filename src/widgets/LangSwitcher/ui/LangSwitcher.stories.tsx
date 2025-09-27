import type { Meta, StoryObj } from '@storybook/react';
import { LangSwitcher } from './LangSwitcher';

const meta: Meta<typeof LangSwitcher> = {
    title: 'widgets/LangSwitcher',
    component: LangSwitcher,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LangSwitcher>;

export const Default: Story = {};

export const Short: Story = {
    args: {
        short: true,
    },
};

