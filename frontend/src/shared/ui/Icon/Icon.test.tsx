import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import ThemeIcon from 'shared/assets/icons/theme-light.svg';

describe('Icon', () => {
    test('should render', () => {
        render(<Icon Svg={ThemeIcon} />);
        expect(screen.getByTestId('theme-light.svg')).toBeInTheDocument();
    });
});

