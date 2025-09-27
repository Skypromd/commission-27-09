import type { Meta, StoryObj } from '@storybook/react';
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
    title: 'widgets/Navbar',
    component: Navbar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
    decorators: [StoreDecorator({
        user: { authData: { id: '1', username: 'admin' } },
    })],
};

export const NoAuth: Story = {
    decorators: [StoreDecorator({})],
};

