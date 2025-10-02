import * as commonCommands from './commands/common';
import * as profileCommands from './commands/profile';
import * as articleCommands from './commands/article';

Cypress.Commands.addAll(commonCommands);
Cypress.Commands.addAll(profileCommands);
Cypress.Commands.addAll(articleCommands);

declare global {
    namespace Cypress {
        interface Chainable {
            getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
            login(username?: string, password?: string): Chainable<any>;
            resetProfile(profileId: string): Chainable<any>;
            addComment(text: string): Chainable<any>;
            rateArticle(starsCount?: number, feedback?: string): Chainable<any>;
        }
    }
}
