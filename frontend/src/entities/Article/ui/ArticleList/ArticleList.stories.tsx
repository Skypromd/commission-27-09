import type { Meta, StoryObj } from '@storybook/react';
import { ArticleList } from './ArticleList';
import { Article, ArticleBlockType, ArticleView } from '../../model/types/article';

const meta: Meta<typeof ArticleList> = {
    title: 'entities/ArticleList',
    component: ArticleList,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArticleList>;

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

export const List: Story = {
    args: {
        articles: new Array(9).fill(0).map((item, index) => ({
            ...article,
            id: String(index),
        })),
        view: ArticleView.LIST,
    },
};

export const Grid: Story = {
    args: {
        articles: new Array(9).fill(0).map((item, index) => ({
            ...article,
            id: String(index),
        })),
        view: ArticleView.GRID,
    },
};

export const LoadingList: Story = {
    args: {
        articles: [],
        view: ArticleView.LIST,
        isLoading: true,
    },
};

export const LoadingGrid: Story = {
    args: {
        articles: [],
        view: ArticleView.GRID,
        isLoading: true,
    },
};

