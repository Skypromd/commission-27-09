import { screen } from '@testing-library/react';
import { componentRender } from 'shared/lib/tests/componentRender/componentRender';
import { ProfilePage } from 'pages/ProfilePage';
import { Country } from 'entities/Country';
import { Currency } from 'entities/Currency';
import userEvent from '@testing-library/user-event';
import { profileReducer } from 'entities/Profile';
import { $api } from 'shared/api/api';

const profile = {
    form: {
        username: 'admin',
        age: 35,
        country: Country.United_Kingdom,
        lastname: 'Smith',
        first: 'John',
        city: 'London',
        currency: Currency.GBP,
    },
};

describe('ProfilePage', () => {
    test('Test render', () => {
        componentRender(<ProfilePage />);
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    test('should render with data', () => {
        componentRender(<ProfilePage />, {
            initialState: {
                profile,
            },
        });
        expect(screen.getByTestId('ProfileCard.firstname')).toHaveValue('John');
        expect(screen.getByTestId('ProfileCard.lastname')).toHaveValue('Smith');
    });

    test('should edit profile', async () => {
        componentRender(<ProfilePage />, {
            initialState: {
                profile,
            },
        });
        await userEvent.click(screen.getByTestId('ProfilePageHeader.EditButton'));
        expect(screen.getByTestId('ProfilePageHeader.SaveButton')).toBeInTheDocument();
        expect(screen.getByTestId('ProfilePageHeader.CancelButton')).toBeInTheDocument();
    });

    test('should cancel editing', async () => {
        componentRender(<ProfilePage />, {
            initialState: {
                profile,
            },
        });
        await userEvent.click(screen.getByTestId('ProfilePageHeader.EditButton'));

        const firstnameInput = screen.getByTestId('ProfileCard.firstname');
        const lastnameInput = screen.getByTestId('ProfileCard.lastname');

        await userEvent.clear(firstnameInput);
        await userEvent.clear(lastnameInput);

        await userEvent.type(firstnameInput, 'user');
        await userEvent.type(lastnameInput, 'user');

        expect(firstnameInput).toHaveValue('user');
        expect(lastnameInput).toHaveValue('user');

        await userEvent.click(screen.getByTestId('ProfilePageHeader.CancelButton'));

        expect(screen.getByTestId('ProfileCard.firstname')).toHaveValue('John');
        expect(screen.getByTestId('ProfileCard.lastname')).toHaveValue('Smith');
    });

    test('should show validation error', async () => {
        componentRender(<ProfilePage />, {
            initialState: {
                profile,
            },
        });
        await userEvent.click(screen.getByTestId('ProfilePageHeader.EditButton'));

        const firstnameInput = screen.getByTestId('ProfileCard.firstname');
        await userEvent.clear(firstnameInput);

        await userEvent.click(screen.getByTestId('ProfilePageHeader.SaveButton'));

        expect(screen.getByTestId('ProfilePage.Error.Paragraph')).toBeInTheDocument();
    });

    test('should save profile', async () => {
        const mockPut = jest.spyOn($api, 'put');
        componentRender(<ProfilePage />, {
            initialState: {
                profile,
                user: {
                    authData: { id: '1' },
                },
            },
            asyncReducers: { profile: profileReducer },
        });
        await userEvent.click(screen.getByTestId('ProfilePageHeader.EditButton'));

        const firstnameInput = screen.getByTestId('ProfileCard.firstname');
        await userEvent.clear(firstnameInput);
        await userEvent.type(firstnameInput, 'user');

        await userEvent.click(screen.getByTestId('ProfilePageHeader.SaveButton'));

        expect(mockPut).toHaveBeenCalled();
    });
});
