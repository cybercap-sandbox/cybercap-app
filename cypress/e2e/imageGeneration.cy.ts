/// <reference types="cypress" />

describe(
  "Test image generation playground",
  {
    defaultCommandTimeout: 25000,
  },
  function () {
    beforeEach(() => {
      cy.viewport("macbook-15");

      cy.loginWithMockUser();
      cy.visit("/image-generation");
    });

    it("Image generation playground prompt form should not be visible for not authorized user and visible for authorized", function () {
      // should be request to get previously generated images
      cy.intercept(
        "GET",
        "/api/trpc/imageGenerationLog.getImagesGeneratedByUser*"
      ).as("getImagesGeneratedByUser");
      cy.wait("@getImagesGeneratedByUser");
      // if the user is authorized, the form should be visible
      cy.dataCy("imageGenerationForm").should("be.visible");

      // if the user is not authorized, the textarea should not be visible
      cy.intercept("POST", "/api/auth/signout").as("signout");
      cy.dataCy("logoutButton").click();
      cy.wait("@signout");
      cy.visit("/chat");

      cy.dataCy("imageGenerationForm").should("not.exist");
    });

    it("Checks submit the form with a prompt to api and showing mock image, save user request, save image to bucket request and save image data to db request", function () {
      cy.dataCy("imageGenerationPromptInput").click();
      cy.dataCy("imageGenerationPromptInput").type("A cute cat");

      // check if the request is saved on the server
      cy.intercept("POST", "/api/trpc/imageGenerationLog.saveUserRequest*").as(
        "saveUserRequest"
      );

      // send the prompt to the server and wait for the response
      cy.intercept("POST", "/api/trpc/openai.generateImage*", [
        {
          result: {
            data: {
              json: [
                { url: `${Cypress.config().baseUrl}/mockGeneratedImage.jpg` },
              ],
            },
          },
        },
      ]).as("imageGeneration");

      // save image to S3 bucket request
      cy.intercept("POST", "/api/files/upload*").as(
        "saveGeneratedImageIntoBucket"
      );

      // save image data to db request
      cy.intercept(
        "POST",
        "/api/trpc/imageGenerationLog.saveGeneratedImages*"
      ).as("saveGeneratedImagesInfoToDb");

      // send the prompt to the server
      cy.dataCy("submitImageGenerationPromptButton").click();

      cy.wait("@saveUserRequest");
      cy.wait("@imageGeneration");
      cy.wait("@saveGeneratedImageIntoBucket");
      cy.wait("@saveGeneratedImagesInfoToDb");
    });
  }
);
