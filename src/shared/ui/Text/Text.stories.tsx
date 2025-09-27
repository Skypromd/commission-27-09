import type { Meta, StoryObj } from '@storybook/react';
import { Text, TextAlign, TextTheme } from './Text';

const meta: Meta<typeof Text> = {
    title: 'shared/Text',
    component: Text,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {
    args: {
        title: 'Title lorem ipsum',
        text: 'Description Description Description Description',
    },
};

export const Error: Story = {
    args: {
        title: 'Error Title',
        text: 'Error description text.',
        theme: TextTheme.ERROR,
    },
};

export const OnlyTitle: Story = {
    args: {
        title: 'Title lorem ipsum',
    },
};

export const OnlyText: Story = {
    args: {
        text: 'Description Description Description Description',
    },
};

export const AlignRight: Story = {
    args: {
        title: 'Title lorem ipsum',
        text: 'Description Description Description Description',
        align: TextAlign.RIGHT,
    },
};

export const AlignCenter: Story = {
    args: {
        title: 'Title lorem ipsum',
        text: 'Description Description Description Description',
        align: TextAlign.CENTER,
    },
};

