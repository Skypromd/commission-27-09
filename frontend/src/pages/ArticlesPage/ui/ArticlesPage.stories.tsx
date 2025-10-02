import type { Meta, StoryObj } from '@storybook/react';
import { ArticlesPage } from './ArticlesPage';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';
import { StoreDecorator } from 'shared/config/storybook/StoreDecorator/StoreDecorator';
import { Article, ArticleBlockType, ArticleView } from 'entities/Article';

const meta: Meta<typeof ArticlesPage> = {
    title: 'pages/ArticlesPage',
    component: ArticlesPage,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArticlesPage>;

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
            paragraphs: [],
        },
    ],
};

const articles = new Array(9).fill(0).map((item, index) => ({
    ...article,
    id: String(index),
}));

export const Normal: Story = {
    args: {},
    decorators: [StoreDecorator({
        articlesPage: {
            ids: articles.map((a) => a.id),
            entities: articles.reduce((acc, a) => {
                acc[a.id] = a;
                return acc;
            }, {}),
            view: ArticleView.LIST,
        },
    })],
};

export const Dark: Story = {
    args: {},
    decorators: [
        ThemeDecorator(Theme.DARK),
        StoreDecorator({
            articlesPage: {
                ids: articles.map((a) => a.id),
                entities: articles.reduce((acc, a) => {
                    acc[a.id] = a;
                    return acc;
                }, {}),
                view: ArticleView.LIST,
            },
        }),
    ],
};
