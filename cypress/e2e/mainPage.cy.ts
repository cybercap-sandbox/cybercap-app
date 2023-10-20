/// <reference types="cypress" />
export type TestUser = {
  name: string;
  abbreviatedName: string;
  email: string;
  sessionToken: string;
};

describe("Test authorized user", function () {
  it("Shows user name and email on the main page", function () {
    cy.loginWithMockUser();
    cy.fixture<TestUser>("testUser").then((user) => {
      cy.dataCy("welcomeName").should("contain.text", user.name);
      cy.dataCy("welcomeEmail").should("contain.text", user.email);
    });
  });

  it("Should not show user data if the user is not authorized", function () {
    cy.clearCookie("next-auth.session-token");
    cy.dataCy("welcomeName").should("not.exist");
    cy.dataCy("welcomeEmail").should("not.exist");
  });
});
