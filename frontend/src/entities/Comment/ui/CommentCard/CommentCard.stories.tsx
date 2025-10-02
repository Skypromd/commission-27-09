import type { Meta, StoryObj } from '@storybook/react';
import { CommentCard } from './CommentCard';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';
import { Comment } from '../../model/types/comment';

const meta: Meta<typeof CommentCard> = {
    title: 'entities/CommentCard',
    component: CommentCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommentCard>;

const comment: Comment = {
    id: '1',
    text: 'hello world',
    user: { id: '1', username: 'John' },
};

export const Normal: Story = {
    args: {
        comment,
    },
};

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};

export const Dark: Story = {
    args: {
        comment,
    },
    decorators: [ThemeDecorator(Theme.DARK)],
};

