describe('Routing', () => {
    describe('Unauthenticated user', () => {
        it('should navigate to the main page and check accessibility', () => {
            cy.visit('/');
            cy.getByTestId('main-page').should('exist');
            cy.checkA11y();
            cy.percySnapshot('Main page');
        });

        it('should navigate to the about page', () => {
            cy.visit('/about');
            cy.getByTestId('about-page').should('exist');
            cy.checkA11y();
            cy.percySnapshot('About page');
        });

        it('should redirect to main page from profile page', () => {
            cy.visit('/profile/1');
            cy.getByTestId('main-page').should('exist');
        });

        it('should navigate to a non-existent route', () => {
            cy.visit('/non-existent-route');
            cy.getByTestId('not-found-page').should('exist');
        });
    });

    describe('Authenticated user', () => {
        beforeEach(() => {
            cy.login();
        });

        it('should navigate to the profile page', () => {
            cy.visit('/profile/4');
            cy.getByTestId('profile-page').should('exist');
        });

        it('should navigate to the articles page', () => {
            cy.visit('/articles');
            cy.getByTestId('articles-page').should('exist');
        });
    });
});
