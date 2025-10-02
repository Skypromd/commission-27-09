import type { Meta, StoryObj } from '@storybook/react';
import { CommentList } from './CommentList';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';
import { Comment } from '../../model/types/comment';

const meta: Meta<typeof CommentList> = {
    title: 'entities/CommentList',
    component: CommentList,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommentList>;

const comments: Comment[] = [
    {
        id: '1',
        text: 'hello world',
        user: { id: '1', username: 'John' },
    },
    {
        id: '2',
        text: 'comment 2',
        user: { id: '2', username: 'Jane' },
    },
];

export const Normal: Story = {
    args: {
        comments,
    },
};

export const Loading: Story = {
    args: {
        comments: [],
        isLoading: true,
    },
};

export const NoComments: Story = {
    args: {
        comments: [],
    },
};

export const Dark: Story = {
    args: {
        comments,
    },
    decorators: [ThemeDecorator(Theme.DARK)],
};

