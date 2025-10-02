import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import { ArticleListItem } from './ArticleListItem';
import { Article, ArticleBlockType, ArticleView } from '../../model/types/article';

const article: Article = {
    id: '1',
    title: 'Javascript news',
    subtitle: 'Что нового в JS за 2022 год?',
    img: 'https://teknotower.com/wp-content/uploads/2020/11/js.png',
    views: 1022,
    createdAt: '26.02.2022',
    user: { id: '1', username: 'admin' },
    type: [],
    blocks: [
        {
            id: '1',
            type: ArticleBlockType.TEXT,
            title: 'Заголовок этого блока',
            paragraphs: [],
        },
    ],
};

describe('ArticleListItem', () => {
    test('should render in LIST view', () => {
        componentRender(<ArticleListItem article={article} view={ArticleView.LIST} />);
        expect(screen.getByText('Javascript news')).toBeInTheDocument();
        expect(screen.getByText('1022')).toBeInTheDocument();
    });

    test('should render in GRID view', () => {
        componentRender(<ArticleListItem article={article} view={ArticleView.GRID} />);
        expect(screen.getByText('Javascript news')).toBeInTheDocument();
    });

    test('should render loader in LIST view', () => {
        componentRender(<ArticleListItem article={{} as Article} view={ArticleView.LIST} isLoading />);
        expect(screen.getByTestId('ArticleListItem.LIST.Loading')).toBeInTheDocument();
    });

    test('should render loader in GRID view', () => {
        componentRender(<ArticleListItem article={{} as Article} view={ArticleView.GRID} isLoading />);
        expect(screen.getByTestId('ArticleListItem.GRID.Loading')).toBeInTheDocument();
    });
});

