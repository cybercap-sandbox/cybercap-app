/// <reference types="cypress" />
export type TestUser = {
  name: string;
  abbreviatedName: string;
  email: string;
  sessionToken: string;
};

describe("Checks main page content", () => {
  beforeEach(() => {
    cy.visit("/");
  });
});

describe("Test authorized user", function () {
  beforeEach(function () {
    cy.loginWithMockUser();
  });

  it("Shows user name and email on the main page", function () {
    cy.fixture<TestUser>("testUser").then((user) => {
      cy.dataCy("welcomeName").should("contain.text", user.name);
      cy.dataCy("welcomeEmail").should("contain.text", user.email);
    });
  });
});
