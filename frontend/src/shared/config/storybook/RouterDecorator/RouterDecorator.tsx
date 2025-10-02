import { Story } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

export const RouterDecorator = (story: () => Story) => (
    <MemoryRouter>
        {story()}
    </MemoryRouter>
);
