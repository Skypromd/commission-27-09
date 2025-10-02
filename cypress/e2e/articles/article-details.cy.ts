describe('Article details page', () => {
    beforeEach(() => {
        cy.login();
        cy.intercept('GET', '**/articles/*', { fixture: 'article-details.json' });
        cy.visit('/articles/1');
    });

    it('should show article content and check accessibility', () => {
        cy.getByTestId('ArticleDetails.Info').should('exist');
        cy.checkA11y();
        cy.percySnapshot('Article details page');
    });

    it('should show recommendations list', () => {
        cy.getByTestId('ArticleRecommendationsList').should('exist');
    });

    it('should post a comment', () => {
        cy.intercept('GET', '**/articles/1/comments', { fixture: 'comments.json' });
        cy.getByTestId('AddCommentForm').scrollIntoView();
        cy.addComment('test comment');
        cy.getByTestId('CommentCard.Content').should('have.length', 1);
    });

    it('should rate the article', () => {
        cy.intercept('GET', '**/articles/1/comments', { fixture: 'comments.json' });
        cy.getByTestId('ArticleDetails.Info');
        cy.getByTestId('RatingCard').scrollIntoView();
        cy.rateArticle(4, 'good article');
        cy.getByTestId('RatingCard').should('contain.text', 'Спасибо за оценку!');
    });
});
