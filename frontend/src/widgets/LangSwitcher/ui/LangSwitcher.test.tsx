import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithTranslation } from 'shared/lib/tests/renderWithTranslation/renderWithTranslation';
import { LangSwitcher } from 'widgets/LangSwitcher';
import i18nForTests from 'shared/config/i18n/i18nForTests';

describe('LangSwitcher', () => {
    test('Test render', () => {
        renderWithTranslation(<LangSwitcher />);
        expect(screen.getByRole('button', { name: 'RU' })).toBeInTheDocument();
    });

    test('toggle lang', () => {
        renderWithTranslation(<LangSwitcher />);
        const toggleBtn = screen.getByRole('button', { name: 'RU' });
        fireEvent.click(toggleBtn);
        expect(i18nForTests.language).toBe('en');
        fireEvent.click(toggleBtn);
        expect(i18nForTests.language).toBe('ru');
    });
});

