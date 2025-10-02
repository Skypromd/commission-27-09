import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
    test('should render with src', () => {
        render(<Avatar src="test.jpg" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'test.jpg');
    });

    test('should have correct size', () => {
        const size = 150;
        render(<Avatar src="test.jpg" size={size} />);
        const img = screen.getByRole('img');
        expect(img).toHaveStyle({ width: `${size}px`, height: `${size}px` });
    });
});

