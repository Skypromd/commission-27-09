import type { Meta, StoryObj } from '@storybook/react';
import { RatingCard } from './RatingCard';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';
import { StoreDecorator } from 'shared/config/storybook/StoreDecorator/StoreDecorator';

const meta: Meta<typeof RatingCard> = {
    title: 'features/RatingCard',
    component: RatingCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RatingCard>;

export const Normal: Story = {
    args: {
        title: 'Как вам статья?',
    },
    decorators: [StoreDecorator({})],
};

export const Rated: Story = {
    args: {
        title: 'Как вам статья?',
        rate: 4,
    },
    decorators: [StoreDecorator({})],
};

export const Dark: Story = {
    args: {
        title: 'Как вам статья?',
    },
    decorators: [ThemeDecorator(Theme.DARK), StoreDecorator({})],
};
