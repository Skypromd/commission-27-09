import { render, screen } from '@testing-library/react';
import { AboutPage } from 'pages/AboutPage';
import { renderWithTranslation } from 'shared/lib/tests/renderWithTranslation/renderWithTranslation';

describe('AboutPage', () => {
    test('Test render', () => {
        renderWithTranslation(<AboutPage />);
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });
});

