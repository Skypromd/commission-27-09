describe('Articles page', () => {
    beforeEach(() => {
        cy.login().then(() => {
            cy.intercept('GET', '**/articles?*', { fixture: 'articles.json' });
            cy.visit('/articles');
        });
    });

    it('should load articles list and check accessibility', () => {
        cy.getByTestId('ArticleList').should('exist');
        cy.getByTestId('ArticleListItem').should('have.length', 4);
        cy.checkA11y();
        cy.percySnapshot('Articles list page');
    });

    it('should search for an article', () => {
        cy.getByTestId('ArticlePageFilters.Search').type('Javascript');
        cy.getByTestId('ArticleList').should('exist');
        cy.getByTestId('ArticleListItem').should('have.length', 1);
        cy.getByTestId('ArticleListItem').should('contain', 'Javascript news');
    });
});
