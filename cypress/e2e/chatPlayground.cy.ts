/// <reference types="cypress" />

describe("Test chat playground", function () {
  beforeEach(() => {
    cy.viewport("macbook-15");

    cy.loginWithMockUser();
    cy.visit("/chat");
  });

  it("Chat playground textarea prompt should not be visible for not authorized user and visible for authorized", function () {
    // if the user is authorized, the textarea should be visible
    cy.dataCy("promptInput").should("be.visible");

    // if the user is not authorized, the textarea should not be visible
    cy.intercept("POST", "/api/auth/signout").as("signout");
    cy.dataCy("logoutButton").click();
    cy.wait("@signout");
    cy.visit("/chat");

    cy.dataCy("promptInput").should("not.exist");
  });

  it("Model select should contain 5 models", function () {
    cy.dataCy("modelSelectButton").click();
    cy.dataCy("modelSelectList").should("be.visible");
    cy.dataCy("modelSelectItem").should("have.length", 5);
  });

  it("Should create a new chat session when there is no active session and user clicks on the prompt textarea", function () {
    // wait for user chat sessions to load from the server

    cy.intercept(
      "/api/trpc/*chatSession.getAllStreamsWithMessagesForCurrentUser*"
    ).as("loadChatSessions");
    cy.wait("@loadChatSessions");
    cy.dataCy("chatSessionItem").should("not.exist", 0);

    cy.dataCy("promptInput").click();
    cy.dataCy("chatSessionItem").should("have.length", 1);
  });

  it("Checks creation of a new chat session, sending a prompt to api and showing chat messages", function () {
    cy.dataCy("promptInput").click();
    cy.dataCy("promptInput").type("Hello, how are you?");

    cy.intercept("POST", "/api/chat", "Hi! How can I help you?").as(
      "chatMessage"
    );
    cy.dataCy("submitPromptButton").click();

    // should be 1 message from the user and 1 from the assistant
    cy.wait("@chatMessage");

    // 2 messages should be visible
    cy.dataCy("chatMessage").should("have.length", 2);
    // 2 badges should be visible
    cy.dataCy("chatMemberType").should("have.length", 2);
    // first badge should be "You" and second "AI Assistant"
    cy.dataCy("chatMemberType").eq(0).should("have.text", "You");
    cy.dataCy("chatMemberType").eq(1).should("have.text", "AI Assistant");

    // chat session should have name of the first message
    cy.dataCy("chatSessionItem").should("have.text", "Hello, how are you?");
  });

  it("Create chat session button should create new chat session", function () {
    // wait for user chat sessions to load from the server
    cy.intercept(
      "/api/trpc/*chatSession.getAllStreamsWithMessagesForCurrentUser*"
    ).as("loadChatSessions");
    cy.wait("@loadChatSessions");
    cy.dataCy("chatSessionItem").should("not.exist", 0);

    cy.dataCy("createChatSessionButton").click();
    cy.dataCy("chatSessionItem").should("have.length", 1);
  });

  it("Rename chat session button should open rename dialog and save new name", function () {
    // wait for user chat sessions to load from the server
    cy.intercept(
      "/api/trpc/*chatSession.getAllStreamsWithMessagesForCurrentUser*"
    ).as("loadChatSessions");
    cy.wait("@loadChatSessions");

    // create new chat session
    cy.dataCy("createChatSessionButton").click();

    // click on the chat session item
    cy.dataCy("chatSessionItem").click();
    cy.dataCy("renameChatSessionButton").should("be.visible");
    cy.dataCy("deleteChatSessionButton").should("be.visible");

    // rename chat session
    const newName = "New name 12345";
    cy.dataCy("renameChatSessionButton").click();
    cy.dataCy("renameChatSessionInput").type("{selectall}{backspace}");
    cy.dataCy("renameChatSessionInput").type(newName);
    // make sure the request is sent to the server
    cy.intercept("POST", "/api/trpc/chatSession.updateChatSession*").as(
      "updateChatSession"
    );
    cy.dataCy("renameChatSessionSubmitButton").click();
    cy.wait("@updateChatSession");

    cy.dataCy("chatSessionItem").should("have.text", newName);
  });

  it("Delete button should delete chat session", function () {
    // wait for user chat sessions to load from the server
    cy.intercept(
      "/api/trpc/*chatSession.getAllStreamsWithMessagesForCurrentUser*"
    ).as("loadChatSessions");
    cy.wait("@loadChatSessions");

    // create new chat session
    cy.dataCy("createChatSessionButton").click();

    // click on the chat session item
    cy.dataCy("chatSessionItem").click();
    cy.dataCy("renameChatSessionButton").should("be.visible");
    cy.dataCy("deleteChatSessionButton").should("be.visible");

    // delete chat session
    cy.intercept("POST", "/api/trpc/chatSession.deleteChatSession*").as(
      "deleteChatSession"
    );
    cy.dataCy("deleteChatSessionButton").click();
    cy.wait("@deleteChatSession");

    cy.dataCy("chatSessionItem").should("not.exist");
  });
});
