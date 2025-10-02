import type { Meta, StoryObj } from '@storybook/react';
import { MainPage } from './MainPage';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';
import { StoreDecorator } from 'shared/config/storybook/StoreDecorator/StoreDecorator';

const meta: Meta<typeof MainPage> = {
  title: 'pages/MainPage',
  component: MainPage,
  decorators: [ThemeDecorator(Theme.LIGHT), StoreDecorator({})],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
