import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'), // Пытаемся получить токен из localStorage при запуске
  user: null, // Пользователь изначально неизвестен
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload }: PayloadAction<{ token?: string; user?: User }>
    ) => {
      if (payload.token) {
        state.token = payload.token;
        localStorage.setItem('token', payload.token); // Сохраняем токен
      }
      if (payload.user) {
        state.user = payload.user;
      }
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token'); // Удаляем токен
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
