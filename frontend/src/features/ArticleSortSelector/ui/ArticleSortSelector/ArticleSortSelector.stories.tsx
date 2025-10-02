import type { Meta, StoryObj } from '@storybook/react';
import { ArticleSortSelector } from './ArticleSortSelector';
import { ArticleSortField } from 'entities/Article';

const meta: Meta<typeof ArticleSortSelector> = {
    title: 'features/ArticleSortSelector',
    component: ArticleSortSelector,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArticleSortSelector>;

export const Normal: Story = {
    args: {
        sort: ArticleSortField.CREATED,
        order: 'asc',
    },
};

