import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
    stories: ['../../frontend/src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-percy',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    webpackFinal: async (config) => {
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                app: path.resolve(__dirname, '..', 'frontend', 'src', 'app'),
                pages: path.resolve(__dirname, '..', 'frontend', 'src', 'pages'),
                widgets: path.resolve(__dirname, '..', 'frontend', 'src', 'widgets'),
                features: path.resolve(__dirname, '..', 'frontend', 'src', 'features'),
                entities: path.resolve(__dirname, '..', 'frontend', 'src', 'entities'),
                shared: path.resolve(__dirname, '..', 'frontend', 'src', 'shared'),
            };
        }

        // @ts-ignore
        config.module.rules = config.module.rules.map((rule) => {
            // @ts-ignore
            if (/svg/.test(rule.test as string)) {
                // @ts-ignore
                return { ...rule, exclude: /\.svg$/i };
            }
            return rule;
        });
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

export default config;
