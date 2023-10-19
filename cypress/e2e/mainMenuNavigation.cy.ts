/// <reference types="cypress" />

describe("Checks top panel content", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("include", "/");
  });
  it("Checks each link in the desktop main menu has the expected text and leads to the expected page", () => {
    cy.fixture("mainMenu").then((mainMenu) => {
      mainMenu.forEach((item) => {
        cy.dataCy(`desktop-navbar-${item.key}`)
          .should("have.attr", "href", item.href)
          .should("have.text", item.englishLabel)
          .click();

        // check if the login page is loaded
        cy.url().should("include", item.href);
      });
    });
  });
});
