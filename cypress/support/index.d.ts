// cypress/support/index.ts
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      loginWithMockUser(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
