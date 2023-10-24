/// <reference types="cypress" />

describe("Test chat playground", function () {
  beforeEach(() => {
    cy.viewport("macbook-15");

    cy.loginWithMockUser();
    cy.visit("/chat");
  });

  //   it("Chat playground textarea prompt should not be visible for not authorized user and visible for authorized", function () {
  //     // if the user is authorized, the textarea should be visible
  //     cy.dataCy("promptInput").should("be.visible");

  //     // if the user is not authorized, the textarea should not be visible
  //     cy.dataCy("logoutButton").click();
  //     cy.intercept("POST", "/api/auth/signout").as("signout");
  //     cy.wait("@signout");
  //     cy.visit("/chat");

  //     cy.dataCy("promptInput").should("not.exist");

  // reset and seed the database to restore the initial state
  //   cy.exec("npx prisma db push --force-reset");
  //   cy.exec("npx prisma db seed");
  //   });

  //   it("Model select should contain 5 models", function () {
  //     cy.dataCy("modelSelectButton").click();
  //     cy.dataCy("modelSelectList").should("be.visible");
  //     cy.dataCy("modelSelectItem").should("have.length", 5);
  //   });

  it("Should create a new chat session when there is no active session and user clicks on the prompt textarea", function () {
    // wait for user chat sessions to load from the server

    cy.intercept("/api/trpc/**").as("loadChatSessions");
    cy.wait("@loadChatSessions");

    cy.dataCy("promptInput").click();
    cy.dataCy("chatSessionItem").should("have.length", 1);
  });
});
