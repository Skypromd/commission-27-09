import type { Meta, StoryObj } from '@storybook/react';
import ArticleDetailsPage from './ArticleDetailsPage';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';
import { StoreDecorator } from 'shared/config/storybook/StoreDecorator/StoreDecorator';
import { Article, ArticleBlockType } from 'entities/Article';
import { Comment } from 'entities/Comment';

const meta: Meta<typeof ArticleDetailsPage> = {
    title: 'pages/ArticleDetailsPage',
    component: ArticleDetailsPage,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArticleDetailsPage>;

const article: Article = {
    id: '1',
    title: 'Javascript news',
    subtitle: 'Что нового в JS за 2022 год?',
    img: 'https://teknotower.com/wp-content/uploads/2020/11/js.png',
    views: 1022,
    createdAt: '26.02.2022',
    user: { id: '1', username: 'admin' },
    type: [],
    blocks: [
        {
            id: '1',
            type: ArticleBlockType.TEXT,
            title: 'Заголовок этого блока',
            paragraphs: ['Программа, которую по традиции называют «Hello, world!», очень проста.'],
        },
    ],
};

const comments: Comment[] = [
    {
        id: '1',
        text: 'some comment',
        user: { id: '1', username: 'user' },
    },
    {
        id: '2',
        text: 'some comment 2',
        user: { id: '2', username: 'user 2' },
    },
];

export const Normal: Story = {
    args: {},
    decorators: [StoreDecorator({
        articleDetails: {
            data: article,
        },
        articleDetailsPage: {
            comments: {
                ids: ['1', '2'],
                entities: {
                    1: comments[0],
                    2: comments[1],
                },
            },
        },
    })],
};

export const Dark: Story = {
    args: {},
    decorators: [
        ThemeDecorator(Theme.DARK),
        StoreDecorator({
            articleDetails: {
                data: article,
            },
            articleDetailsPage: {
                comments: {
                    ids: ['1', '2'],
                    entities: {
                        1: comments[0],
                        2: comments[1],
                    },
                },
            },
        }),
    ],
};

export const Loading: Story = {
    args: {},
    decorators: [StoreDecorator({
        articleDetails: {
            isLoading: true,
        },
    })],
};

