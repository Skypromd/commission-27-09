import type { Meta, StoryObj } from '@storybook/react';
import { ArticleListItem } from './ArticleListItem';
import { Article, ArticleBlockType, ArticleView } from '../../model/types/article';

const meta: Meta<typeof ArticleListItem> = {
    title: 'entities/ArticleListItem',
    component: ArticleListItem,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArticleListItem>;

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
        article,
        view: ArticleView.LIST,
    },
};

export const Grid: Story = {
    args: {
        article,
        view: ArticleView.GRID,
    },
};

