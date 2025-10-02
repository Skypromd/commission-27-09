import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';

const meta: Meta<typeof Modal> = {
    title: 'shared/Modal',
    component: Modal,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Primary: Story = {
    args: {
        isOpen: true,
        children: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid commodi consequatur eligendi impedit incidunt necessitatibus possimus quis, quod quos ratione recusandae reiciendis, sed, sunt. Accusantium consequuntur dolorum eum illo libero.',
    },
};

export const Dark: Story = {
    args: {
        isOpen: true,
        children: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid commodi consequatur eligendi impedit incidunt necessitatibus possimus quis, quod quos ratione recusandae reiciendis, sed, sunt. Accusantium consequuntur dolorum eum illo libero.',
    },
    decorators: [ThemeDecorator(Theme.DARK)],
};

