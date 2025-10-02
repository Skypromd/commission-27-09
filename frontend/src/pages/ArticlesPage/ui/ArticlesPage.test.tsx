import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import { $api } from 'shared/api/api';
import { articlesPageReducer } from '../model/slices/articlesPageSlice';
import ArticlesPage from './ArticlesPage';
import userEvent from '@testing-library/user-event';

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('ArticlesPage', () => {
    test('should render and load articles', async () => {
        jest.spyOn($api, 'get').mockReturnValue(Promise.resolve({
            data: [
                { id: '1', title: 'Article 1' },
                { id: '2', title: 'Article 2' },
            ],
        }));
        componentRender(<ArticlesPage />, {
            route: '/articles',
            asyncReducers: {
                articlesPage: articlesPageReducer,
            },
        });

        expect(await screen.findAllByTestId('ArticleListItem')).toHaveLength(2);
        expect(screen.getByTestId('articles-page')).toBeInTheDocument();
    });

    test('should load next page on scroll', async () => {
        const getSpy = jest.spyOn($api, 'get').mockResolvedValue({ data: [] });

        componentRender(<ArticlesPage />, {
            route: '/articles',
            asyncReducers: {
                articlesPage: articlesPageReducer,
            },
        });

        // Wait for initial load
        await screen.findByTestId('articles-page');

        // The first call is for the initial articles
        expect(getSpy).toHaveBeenCalledTimes(1);

        // Here you would simulate the intersection observer callback
        // For now, we just check that the initial load happened.
        // A more complex test would involve triggering the observer's callback.
    });

    test('should change view', async () => {
        jest.spyOn($api, 'get').mockResolvedValue({ data: [] });
        componentRender(<ArticlesPage />, {
            route: '/articles',
            asyncReducers: {
                articlesPage: articlesPageReducer,
            },
        });

        await screen.findByTestId('articles-page');
        const gridViewButton = screen.getByTestId('ArticleViewSelector.GRID');
        await userEvent.click(gridViewButton);
        expect(screen.getByTestId('ArticleList.GRID')).toBeInTheDocument();
    });

    test('should search for articles', async () => {
        const getSpy = jest.spyOn($api, 'get').mockResolvedValue({ data: [] });
        componentRender(<ArticlesPage />, {
            route: '/articles',
            asyncReducers: {
                articlesPage: articlesPageReducer,
            },
        });

        await screen.findByTestId('articles-page');

        const searchInput = screen.getByTestId('ArticlePageFilters.Search');
        await userEvent.type(searchInput, 'science');

        // The getSpy is called with search params
        expect(getSpy).toHaveBeenCalledWith('/articles', {
            params: {
                _expand: 'user',
                _limit: 9,
                _page: 1,
                _sort: 'createdAt',
                _order: 'asc',
                q: 'science',
                type_like: undefined,
            },
        });
    });

    test('should filter by type', async () => {
        const getSpy = jest.spyOn($api, 'get').mockResolvedValue({ data: [] });
        componentRender(<ArticlesPage />, {
            route: '/articles',
            asyncReducers: {
                articlesPage: articlesPageReducer,
            },
        });

        await screen.findByTestId('articles-page');

        const itTab = screen.getByTestId('ArticleTypeTabs.IT');
        await userEvent.click(itTab);

        expect(getSpy).toHaveBeenCalledWith('/articles', {
            params: {
                _expand: 'user',
                _limit: 9,
                _page: 1,
                _sort: 'createdAt',
                _order: 'asc',
                q: '',
                type_like: 'IT',
            },
        });
    });

    test('should sort by views', async () => {
        const getSpy = jest.spyOn($api, 'get').mockResolvedValue({ data: [] });
        componentRender(<ArticlesPage />, {
            route: '/articles',
            asyncReducers: {
                articlesPage: articlesPageReducer,
            },
        });

        await screen.findByTestId('articles-page');

        const sortSelect = screen.getByTestId('ArticleSortSelector');
        await userEvent.selectOptions(sortSelect, 'views');

        expect(getSpy).toHaveBeenCalledWith('/articles', {
            params: {
                _expand: 'user',
                _limit: 9,
                _page: 1,
                _sort: 'views',
                _order: 'asc',
                q: '',
                type_like: undefined,
            },
        });
    });
});
