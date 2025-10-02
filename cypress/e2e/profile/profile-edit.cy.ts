let profileId: string;

describe('Profile page', () => {
    beforeEach(() => {
        cy.login().then((data) => {
            profileId = data.id;
            cy.visit(`/profile/${profileId}`);
        });
    });

    afterEach(() => {
        cy.resetProfile(profileId);
    });

    it('should load profile page and check accessibility', () => {
        cy.getByTestId('ProfileCard.firstname').should('have.value', 'John');
        cy.checkA11y();
        cy.percySnapshot('Profile page');
    });

    it('should edit the profile', () => {
        const newFirstname = 'new';
        const newLastname = 'lastname';

        cy.getByTestId('ProfilePageHeader.EditButton').click();
        cy.getByTestId('ProfileCard.firstname').clear().type(newFirstname);
        cy.getByTestId('ProfileCard.lastname').clear().type(newLastname);
        cy.getByTestId('ProfilePageHeader.SaveButton').click();

        cy.getByTestId('ProfileCard.firstname').should('have.value', newFirstname);
        cy.getByTestId('ProfileCard.lastname').should('have.value', newLastname);
    });
});
