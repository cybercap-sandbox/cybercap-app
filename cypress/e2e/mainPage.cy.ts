/// <reference types="cypress" />

describe("Checks main page content", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("welcomeHeader").as("welcomeHeader");
    cy.dataCy("welcomeText").as("welcomeText");
  });

  it("Checks if favicon is available", () => {
    cy.request("/favicon.ico").then((response) => {
      expect(response.status).to.eq(200); // Assert that the file exists
    });
  });

  it("Checks main page title", () => {
    cy.title().should("eq", "Cybercap | Home");
  });

  it("Checks main page content", () => {
    cy.get("@welcomeHeader").should("have.text", "Welcome to CyberCap");

    cy.get("@welcomeText").should(
      "have.text",
      "The website provides a playground for OpenAI chat and image generation models."
    );
  });
});

describe("Test authorized user", function () {
  beforeEach(function () {
    cy.loginWithMockUser();

    cy.fixture("testUser").as("user");
    cy.dataCy("welcomeName").as("welcomeName");
    cy.dataCy("welcomeEmail").as("welcomeEmail");
  });

  it("Shows user name and email on the main page", function () {
    cy.get("@user").then((user) => {
      cy.get("@welcomeName").should("contain.text", user.name);
    });
    cy.get("@user").then((user) => {
      cy.get("@welcomeEmail").should("contain.text", user.email);
    });
  });
});
