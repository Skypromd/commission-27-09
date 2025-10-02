import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import { CommentCard } from './CommentCard';
import { Comment } from '../../model/types/comment';

const comment: Comment = {
    id: '1',
    text: 'hello world',
    user: { id: '1', username: 'John' },
};

describe('CommentCard', () => {
    test('should render with data', () => {
        componentRender(<CommentCard comment={comment} />);
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('hello world')).toBeInTheDocument();
    });

    test('should render loader when loading', () => {
        componentRender(<CommentCard isLoading />);
        expect(screen.getByTestId('CommentCard.Loading')).toBeInTheDocument();
    });
});

