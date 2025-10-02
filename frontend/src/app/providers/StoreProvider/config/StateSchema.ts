import { UserSchema } from '@/entities/User';
import { LoginSchema } from '@/features/AuthByUsername';
import {
    AnyAction, CombinedState, EnhancedStore, Reducer, ReducersMapObject,
} from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { ProfileSchema } from '@/entities/Profile';
import { ArticleDetailsSchema } from '@/entities/Article';
import { ArticlesPageSchema } from '@/pages/ArticlesPage';

export interface StateSchema {
    user: UserSchema;

    // Асинхронные редюсеры
    loginForm?: LoginSchema;
    profile?: ProfileSchema;
    articleDetails?: ArticleDetailsSchema;
    articlesPage?: ArticlesPageSchema;
}

export type StateSchemaKey = keyof StateSchema;
