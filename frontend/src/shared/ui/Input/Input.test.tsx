import { render, screen } from '@testing-library/react';
import { Input } from 'shared/ui/Input/Input';
import { renderWithTranslation } from 'shared/lib/tests/renderWithTranslation/renderWithTranslation';
import userEvent from '@testing-library/user-event';

describe('Input', () => {
    test('Test render with placeholder', () => {
        renderWithTranslation(<Input placeholder="test" />);
        expect(screen.getByPlaceholderText('test')).toBeInTheDocument();
    });

    test('Test typing', async () => {
        renderWithTranslation(<Input placeholder="test" />);
        const input = screen.getByPlaceholderText('test');
        await userEvent.type(input, '123');
        expect(input).toHaveValue('123');
    });
});
