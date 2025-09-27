import type { Meta, StoryObj } from '@storybook/react';
import { ProfileCard } from './ProfileCard';
import { Profile } from '../../model/types/profile';

const meta: Meta<typeof ProfileCard> = {
    title: 'entities/ProfileCard',
    component: ProfileCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

const profileData: Profile = {
    id: '1',
    first: 'John',
    lastname: 'Doe',
    username: 'admin',
};

export const Default: Story = {
    args: {
        data: profileData,
        readonly: true,
    },
};

export const Editing: Story = {
    args: {
        data: profileData,
        readonly: false,
    },
};

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};

export const WithError: Story = {
    args: {
        error: 'true', // The string content doesn't matter, its presence triggers the error view
    },
};

