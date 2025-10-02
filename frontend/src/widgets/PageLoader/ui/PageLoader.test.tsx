import { render, screen } from '@testing-library/react';
import { PageLoader } from 'widgets/PageLoader';
import { renderWithTranslation } from 'shared/lib/tests/renderWithTranslation/renderWithTranslation';

describe('PageLoader', () => {
    test('Test render', () => {
        renderWithTranslation(<PageLoader />);
        expect(screen.getByTestId('page-loader')).toBeInTheDocument();
    });
});

