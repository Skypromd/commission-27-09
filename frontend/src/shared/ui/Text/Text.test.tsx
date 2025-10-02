import { render, screen } from '@testing-library/react';
import { Text, TextAlign, TextTheme } from './Text';

describe('Text', () => {
    test('should render with only title', () => {
        render(<Text title="Test Title" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    test('should render with only text', () => {
        render(<Text text="Test Text" />);
        expect(screen.getByText('Test Text')).toBeInTheDocument();
    });

    test('should render with title and text', () => {
        render(<Text title="Test Title" text="Test Text" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Text')).toBeInTheDocument();
    });

    test('should have error theme', () => {
        render(<Text title="Test Title" theme={TextTheme.ERROR} />);
        expect(screen.getByText('Test Title')).toHaveClass('error');
    });

    test('should have right align', () => {
        render(<Text title="Test Title" align={TextAlign.RIGHT} />);
        expect(screen.getByText('Test Title')).toHaveClass('right');
    });
});

