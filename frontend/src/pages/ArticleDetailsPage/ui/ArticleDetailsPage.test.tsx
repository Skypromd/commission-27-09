import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import ArticleDetailsPage from './ArticleDetailsPage';
import { $api } from 'shared/api/api';
import { articleDetailsPageReducer } from '../model/slices';
import userEvent from '@testing-library/user-event';

describe('ArticleDetailsPage', () => {
    test('Test render', () => {
        componentRender(<ArticleDetailsPage />, {
            route: '/articles/1',
        });
        expect(screen.getByTestId('article-details-page')).toBeInTheDocument();
    });

    test('should load comments on render', async () => {
        jest.spyOn($api, 'get').mockReturnValue(Promise.resolve({
            data: [
                {
                    id: '1',
                    text: 'some comment',
                    user: { id: '1', username: 'user' },
                },
                {
                    id: '2',
                    text: 'some comment 2',
                    user: { id: '2', username: 'user 2' },
                },
            ],
        }));
        componentRender(<ArticleDetailsPage />, {
            route: '/articles/1',
            asyncReducers: {
                articleDetailsPage: articleDetailsPageReducer,
            },
        });

        expect(await screen.findByText('some comment')).toBeInTheDocument();
        expect(await screen.findByText('some comment 2')).toBeInTheDocument();
    });

    test('should send a comment', async () => {
        jest.spyOn($api, 'get').mockReturnValue(Promise.resolve({ data: [] }));
        const mockPost = jest.spyOn($api, 'post').mockReturnValue(Promise.resolve({ data: { text: 'new comment' } }));

        componentRender(<ArticleDetailsPage />, {
            route: '/articles/1',
            asyncReducers: {
                articleDetailsPage: articleDetailsPageReducer,
            },
            initialState: {
                user: { authData: { id: '1' } },
            },
        });

        const input = screen.getByTestId('AddCommentForm.Input');
        const sendBtn = screen.getByTestId('AddCommentForm.Button');

        await userEvent.type(input, 'new comment');
        await userEvent.click(sendBtn);

        expect(mockPost).toHaveBeenCalled();
        expect(await screen.findByText('new comment')).toBeInTheDocument();
    });
});
