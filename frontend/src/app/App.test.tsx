import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import App from './App';

describe('App', () => {
    test('should render about page', () => {
        componentRender(<App />, {
            route: '/about',
        });

        expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });

    test('should render not found page for non-existent route', () => {
        componentRender(<App />, {
            route: '/asfasfasfasf',
        });

        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    test('should render profile page for authenticated user', () => {
        componentRender(<App />, {
            route: '/profile/1',
            initialState: {
                user: { authData: { id: '1', username: 'admin' } },
            },
        });

        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    test('should render articles page for authenticated user', () => {
        componentRender(<App />, {
            route: '/articles',
            initialState: {
                user: { authData: { id: '1', username: 'admin' } },
            },
        });

        expect(screen.getByTestId('articles-page')).toBeInTheDocument();
    });
});
