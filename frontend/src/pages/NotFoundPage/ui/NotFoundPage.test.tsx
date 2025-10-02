import { render, screen } from '@testing-library/react';
import { NotFoundPage } from 'pages/NotFoundPage';
import { renderWithTranslation } from 'shared/lib/tests/renderWithTranslation/renderWithTranslation';

describe('NotFoundPage', () => {
    test('Test render', () => {
        renderWithTranslation(<NotFoundPage />);
        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
});

