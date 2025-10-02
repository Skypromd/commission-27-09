import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import { ProfileCard } from './ProfileCard';
import { Country } from 'entities/Country';
import { Currency } from 'entities/Currency';
import userEvent from '@testing-library/user-event';

const data = {
    username: 'admin',
    age: 35,
    country: Country.United_Kingdom,
    lastname: 'Smith',
    first: 'John',
    city: 'London',
    currency: Currency.GBP,
};

describe('ProfileCard', () => {
    test('should render with data', () => {
        componentRender(<ProfileCard data={data} />);
        expect(screen.getByTestId('ProfileCard.firstname')).toHaveValue('John');
        expect(screen.getByTestId('ProfileCard.lastname')).toHaveValue('Smith');
    });

    test('should render loader when loading', () => {
        componentRender(<ProfileCard isLoading />);
        expect(screen.getByTestId('ProfileCard.Loading')).toBeInTheDocument();
    });

    test('should render error', () => {
        componentRender(<ProfileCard error="error" />);
        expect(screen.getByTestId('ProfileCard.error')).toBeInTheDocument();
    });

    test('should be editable', async () => {
        const onChangeFirstname = jest.fn();
        componentRender(<ProfileCard data={data} readonly={false} onChangeFirstname={onChangeFirstname} />);
        const firstnameInput = screen.getByTestId('ProfileCard.firstname');
        await userEvent.clear(firstnameInput);
        await userEvent.type(firstnameInput, 'new name');
        expect(onChangeFirstname).toHaveBeenCalledWith('new name');
    });
});
