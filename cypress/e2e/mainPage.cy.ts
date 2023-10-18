/// <reference types="cypress" />

describe("Checks main page content", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-cy=welcomeHeader]").as("welcomeHeader");
    cy.get("[data-cy=welcomeText]").as("welcomeText");
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
    cy.get("@welcomeHeader").then((welcomeHeader) => {
      console.log(welcomeHeader.text());
    });
    cy.get("@welcomeHeader").should("have.text", "Welcome to CyberCap");

    cy.get("@welcomeText").should(
      "have.text",
      "The website provides a playground for OpenAI chat and image generation models."
    );
  });
});

describe("Test authorized user", function () {
  beforeEach(function () {
    cy.mockLogin();
    cy.visit("/");
    cy.wait("@session");

    cy.fixture("testUser").as("user");
    cy.get("[data-cy=welcomeName]").as("welcomeName");
    cy.get("[data-cy=welcomeEmail]").as("welcomeEmail");
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
