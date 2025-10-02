import type { Meta, StoryObj } from '@storybook/react';
import { ProfilePage } from './ProfilePage';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';
import { StoreDecorator } from 'shared/config/storybook/StoreDecorator/StoreDecorator';
import { Country } from 'entities/Country';
import { Currency } from 'entities/Currency';

const meta: Meta<typeof ProfilePage> = {
    title: 'pages/ProfilePage',
    component: ProfilePage,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfilePage>;

const data = {
    username: 'admin',
    age: 35,
    country: Country.United_Kingdom,
    lastname: 'Smith',
    first: 'John',
    city: 'London',
    currency: Currency.GBP,
    avatar: 'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg',
};

export const Normal: Story = {
    args: {},
    decorators: [StoreDecorator({
        profile: {
            form: data,
            data,
            readonly: true,
        },
    })],
};

export const Dark: Story = {
    args: {},
    decorators: [
        ThemeDecorator(Theme.DARK),
        StoreDecorator({
            profile: {
                form: data,
                data,
                readonly: true,
            },
        }),
    ],
};

