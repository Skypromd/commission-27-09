import type { Meta, StoryObj } from '@storybook/react';
import { Text, TextSize, TextTheme } from './Text';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';

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
        title: 'Title lorem ipsum',
        text: 'Description Description Description Description',
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

export const PrimaryDark: Story = {
    args: {
        title: 'Title lorem ipsum',
        text: 'Description Description Description Description',
    },
    decorators: [ThemeDecorator(Theme.DARK)],
};

export const OnlyTitleDark: Story = {
    args: {
        title: 'Title lorem ipsum',
    },
    decorators: [ThemeDecorator(Theme.DARK)],
};

export const OnlyTextDark: Story = {
    args: {
        text: 'Description Description Description Description',
    },
    decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeL: Story = {
    args: {
        title: 'Title lorem ipsum',
        text: 'Description Description Description Description',
        size: TextSize.L,
    },
};

