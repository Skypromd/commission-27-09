import { render, screen } from '@testing-library/react';
import { MainPage } from 'pages/MainPage';
import { renderWithTranslation } from 'shared/lib/tests/renderWithTranslation/renderWithTranslation';

describe('MainPage', () => {
    test('Test render', () => {
        renderWithTranslation(<MainPage />);
        expect(screen.getByTestId('main-page')).toBeInTheDocument();
    });
});

