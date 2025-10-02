import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import { CommentList } from './CommentList';
import { Comment } from '../../model/types/comment';

const comments: Comment[] = [
    {
        id: '1',
        text: 'hello world',
        user: { id: '1', username: 'John' },
    },
    {
        id: '2',
        text: 'comment 2',
        user: { id: '2', username: 'Jane' },
    },
];

describe('CommentList', () => {
    test('should render list of comments', () => {
        componentRender(<CommentList comments={comments} />);
        expect(screen.getByText('hello world')).toBeInTheDocument();
        expect(screen.getByText('comment 2')).toBeInTheDocument();
        expect(screen.getAllByTestId('CommentCard.Content')).toHaveLength(2);
    });

    test('should render loader when loading', () => {
        componentRender(<CommentList comments={[]} isLoading />);
        expect(screen.getByTestId('CommentList.Loading')).toBeInTheDocument();
    });

    test('should render "no comments" message', () => {
        componentRender(<CommentList comments={[]} />);
        expect(screen.getByText('Комментарии отсутствуют')).toBeInTheDocument();
    });
});

