import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from '@/services/api'
import authReducer from '@/features/auth/authSlice'
// Просто импортируем срезы, чтобы они зарегистрировали свои эндпоинты
import '../features/clients/clientsApiSlice';
import '../features/mortgages/mortgagesApiSlice';
import '../features/policies/policiesApiSlice';
import '../features/deals/dealsApiSlice';

export const store = configureStore({
  reducer: {
    // Добавляем API-сервис в store
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    // ...other reducers
  },
  // Добавляем middleware от RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Настраиваем слушатели для автоматической перезагрузки данных
setupListeners(store.dispatch)

// Определяем типы для всего приложения
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
