import { Preview } from '@storybook/react';
import { StyleDecorator } from '../../frontend/src/shared/config/storybook/StyleDecorator/StyleDecorator';
import { ThemeDecorator } from '../../frontend/src/shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { RouterDecorator } from '../../frontend/src/shared/config/storybook/RouterDecorator/RouterDecorator';
import { Theme } from '../../frontend/src/app/providers/ThemeProvider';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        StyleDecorator,
        ThemeDecorator(Theme.LIGHT),
        RouterDecorator,
    ],
};

export default preview;

