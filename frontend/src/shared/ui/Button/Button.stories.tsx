import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonSize, ButtonTheme } from './Button';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';

const meta: Meta<typeof Button> = {
    title: 'shared/Button',
    component: Button,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: 'Text',
    },
};

export const Clear: Story = {
    args: {
        children: 'Text',
        theme: ButtonTheme.CLEAR,
    },
};

export const Outline: Story = {
    args: {
        children: 'Text',
        theme: ButtonTheme.OUTLINE,
    },
};

export const OutlineSizeL: Story = {
    args: {
        children: 'Text',
        theme: ButtonTheme.OUTLINE,
        size: ButtonSize.L,
    },
};

export const OutlineDark: Story = {
    args: {
        children: 'Text',
        theme: ButtonTheme.OUTLINE,
    },
    decorators: [ThemeDecorator(Theme.DARK)],
};

export const Background: Story = {
    args: {
        children: 'Text',
        theme: ButtonTheme.BACKGROUND,
    },
};

export const BackgroundInverted: Story = {
    args: {
        children: 'Text',
        theme: ButtonTheme.BACKGROUND_INVERTED,
    },
};

export const Square: Story = {
    args: {
        children: '>',
        theme: ButtonTheme.OUTLINE,
        square: true,
    },
};

export const SquareSizeL: Story = {
    args: {
        children: '>',
        theme: ButtonTheme.OUTLINE,
        square: true,
        size: ButtonSize.L,
    },
};

export const Disabled: Story = {
    args: {
        children: 'Text',
        theme: ButtonTheme.OUTLINE,
        disabled: true,
    },
};
