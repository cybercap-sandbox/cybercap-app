/// <reference types="cypress" />

import { type TestUser } from "./mainPage.cy";

describe("Checks top panel content", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Checks if the menu and the logo are available for different screens", () => {
    cy.dataCy("logoLink").should("have.attr", "href", "/");
    cy.get("[data-cy=logoTitle]:visible").should("have.text", "CyberCap");

    cy.viewport("macbook-15");

    cy.dataCy("desktopLogo").should("be.visible");
    cy.dataCy("mobileLogo").should("not.be.visible");

    cy.dataCy("desktopNavbar").should("be.visible");
    cy.dataCy("mobileNavbar").should("not.be.visible");

    cy.viewport("iphone-6");
    cy.dataCy("desktopLogo").should("not.be.visible");
    cy.dataCy("mobileLogo").should("be.visible");

    cy.dataCy("desktopNavbar").should("not.be.visible");
    cy.dataCy("mobileNavbar").should("be.visible");
  });

  it("Checks if language switcher is available", () => {
    cy.dataCy("localeSelect").should("be.visible");
  });

  it("Checks if login button is available when user is not authorized and leads to the login page", () => {
    const loginLink = "/auth/signin";
    // logout button and user info should not exist
    cy.dataCy("logoutButton").should("not.exist");

    // login button should be visible and lead to the login page
    cy.dataCy("loginLink").should("be.visible").click();

    // check if the login page is loaded
    cy.url().should("include", loginLink);
  });

  it("Checks if logout button is available and works when user is authorized", () => {
    cy.loginWithMockUser();

    // login button should not exist
    cy.dataCy("loginLink").should("not.exist");
    // logout button and user info should be visible
    cy.dataCy("logoutButton").should("be.visible");

    // wait for load to make sure the correct CSRF token is sent as a POST request to /api/auth/signout
    cy.wait(3000);
    // log out
    cy.intercept("/api/auth/csrf").as("signout");
    cy.dataCy("logoutButton").click();
    cy.wait("@signout");

    // check if the user is logged out
    cy.dataCy("loginLink").should("be.visible");
    // logout button and user info should not exist
    cy.dataCy("logoutButton").should("not.exist");
  });

  it("Checks if user info is available when user is authorized", () => {
    cy.loginWithMockUser();

    // user info should be visible on desktop screen and not visible on mobile screen
    cy.viewport("macbook-15");
    cy.dataCy("userInfoContainer").should("exist");
    cy.fixture<TestUser>("testUser").then((user) => {
      cy.dataCy("nameAbbreviation").should("have.text", user.abbreviatedName);
    });

    cy.viewport("iphone-6");
    cy.dataCy("userInfoContainer").should("not.be.visible");
  });
});
