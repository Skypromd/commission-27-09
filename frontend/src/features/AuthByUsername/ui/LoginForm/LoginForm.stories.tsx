import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';
import { StoreDecorator } from 'shared/config/storybook/StoreDecorator/StoreDecorator';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';

const meta: Meta<typeof LoginForm> = {
    title: 'features/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Primary: Story = {
    args: {},
    decorators: [StoreDecorator({})],
};

export const withError: Story = {
    args: {},
    decorators: [StoreDecorator({
        loginForm: { error: 'ERROR' },
    })],
};

export const Loading: Story = {
    args: {},
    decorators: [StoreDecorator({
        loginForm: { isLoading: true },
    })],
};

export const Dark: Story = {
    args: {},
    decorators: [ThemeDecorator(Theme.DARK), StoreDecorator({})],
};
