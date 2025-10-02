import { render, screen } from '@testing-library/react';
import { Select } from 'shared/ui/Select/Select';
import userEvent from '@testing-library/user-event';

describe('Select', () => {
    const options = [
        { value: '123', content: 'First' },
        { value: '456', content: 'Second' },
    ];

    test('Test render with placeholder', () => {
        render(<Select placeholder="Укажите значение" options={options} />);
        expect(screen.getByText('Укажите значение')).toBeInTheDocument();
    });

    test('should open options on click', async () => {
        render(<Select placeholder="Укажите значение" options={options} />);
        const select = screen.getByText('Укажите значение');
        await userEvent.click(select);
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
    });

    test('should select an option', async () => {
        render(<Select placeholder="Укажите значение" options={options} />);
        const select = screen.getByText('Укажите значение');
        await userEvent.click(select);
        await userEvent.click(screen.getByText('Second'));
        expect(screen.getByText('Second')).toBeInTheDocument();
        expect(screen.queryByText('First')).not.toBeInTheDocument();
    });
});
