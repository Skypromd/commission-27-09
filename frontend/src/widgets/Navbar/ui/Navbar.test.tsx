import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import { Navbar } from 'widgets/Navbar';

describe('Navbar', () => {
    test('Test render', () => {
        componentRender(<Navbar />);
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('should render login button when user is not authenticated', () => {
        componentRender(<Navbar />, {
            initialState: { user: { authData: undefined } },
        });
        expect(screen.getByText('Войти')).toBeInTheDocument();
    });

    test('should not render login button when user is authenticated', () => {
        componentRender(<Navbar />, {
            initialState: { user: { authData: { id: '1', username: 'admin' } } },
        });
        expect(screen.queryByText('Войти')).not.toBeInTheDocument();
    });
});

