import type { Meta, StoryObj } from '@storybook/react';
import AddCommentForm from './AddCommentForm';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';
import { StoreDecorator } from 'shared/config/storybook/StoreDecorator/StoreDecorator';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof AddCommentForm> = {
    title: 'features/AddCommentForm',
    component: AddCommentForm,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AddCommentForm>;

export const Normal: Story = {
    args: {
        onSendComment: action('onSendComment'),
    },
    decorators: [StoreDecorator({})],
};

export const Dark: Story = {
    args: {
        onSendComment: action('onSendComment'),
    },
    decorators: [ThemeDecorator(Theme.DARK), StoreDecorator({})],
};
