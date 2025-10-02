import { Article, ArticleView } from './model/types/article';
import { ArticleDetailsSchema } from './model/types/articleDetails';
import { ArticleViewSelector } from './ui/ArticleViewSelector/ArticleViewSelector';
    ArticleViewSelector,
import { articleDetailsReducer } from './model/slice/articleDetailsSlice';
import { fetchArticleById } from './model/services/fetchArticleById/fetchArticleById';
import {
    getArticleDetailsData,
    getArticleDetailsError,
    getArticleDetailsIsLoading,
} from './model/selectors/articleDetails';
import { ArticleDetails } from './ui/ArticleDetails/ArticleDetails';
import { ArticleList } from './ui/ArticleList/ArticleList';

export {
    Article,
    ArticleDetailsSchema,
    ArticleView,
    articleDetailsReducer,
    fetchArticleById,
    getArticleDetailsData,
    getArticleDetailsError,
    getArticleDetailsIsLoading,
    ArticleDetails,
    ArticleList,
};
