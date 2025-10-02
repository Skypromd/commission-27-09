import { LoginSchema } from '../types/loginSchema';
import { loginByUsername } from '../services/loginByUsername/loginByUsername';
import { loginReducer } from './loginSlice';

describe('loginSlice.test', () => {
    test('test login service pending', () => {
        const state: DeepPartial<LoginSchema> = {
            isLoading: false,
            error: 'error',
        };
        expect(loginReducer(
            state as LoginSchema,
            loginByUsername.pending,
        )).toEqual({
            isLoading: true,
            error: undefined,
        });
    });

    test('test login service fulfilled', () => {
        const state: DeepPartial<LoginSchema> = {
            isLoading: true,
        };
        expect(loginReducer(
            state as LoginSchema,
            loginByUsername.fulfilled({ username: 'admin', id: '1' }, '', { username: 'admin', password: '123' }),
        )).toEqual({
            isLoading: false,
        });
    });

    test('test login service rejected', () => {
        const state: DeepPartial<LoginSchema> = {
            isLoading: true,
        };
        expect(loginReducer(
            state as LoginSchema,
            loginByUsername.rejected(new Error(), '', { username: 'admin', password: '123' }, 'error'),
        )).toEqual({
            isLoading: false,
            error: 'error',
        });
    });
});

