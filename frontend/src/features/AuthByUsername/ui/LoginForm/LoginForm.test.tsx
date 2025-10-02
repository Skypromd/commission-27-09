import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import { LoginForm } from './LoginForm';
import { loginReducer } from '../../model/slice/loginSlice';
import userEvent from '@testing-library/user-event';
import { $api } from 'shared/api/api';

describe('LoginForm', () => {
    test('Test render', () => {
        componentRender(<LoginForm onSuccess={() => {}} />, {
            asyncReducers: { loginForm: loginReducer },
        });
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    test('should show error', () => {
        componentRender(<LoginForm onSuccess={() => {}} />, {
            initialState: { loginForm: { error: 'ERROR' } },
            asyncReducers: { loginForm: loginReducer },
        });
        expect(screen.getByText('Вы ввели неверный логин или пароль')).toBeInTheDocument();
    });

    test('should login successfully', async () => {
        const mockPost = jest.spyOn($api, 'post').mockReturnValue(Promise.resolve({ data: { username: 'admin', id: '1' } }));
        const onSuccess = jest.fn();
        componentRender(<LoginForm onSuccess={onSuccess} />, {
            asyncReducers: { loginForm: loginReducer },
        });

        const usernameInput = screen.getByTestId('LoginForm.username');
        const passwordInput = screen.getByTestId('LoginForm.password');
        const loginBtn = screen.getByRole('button', { name: 'Войти' });

        await userEvent.type(usernameInput, 'admin');
        await userEvent.type(passwordInput, '123');
        await userEvent.click(loginBtn);

        expect(mockPost).toHaveBeenCalled();
        expect(onSuccess).toHaveBeenCalled();
    });
});
