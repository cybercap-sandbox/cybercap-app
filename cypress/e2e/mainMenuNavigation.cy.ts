/// <reference types="cypress" />

export type MenuItem = {
  key: string;
  englishLabel: string;
  frenchLabel: string;
  href: string;
};
const mainMenu = [
  {
    key: "home",
    englishLabel: "Home",
    frenchLabel: "Page d'accueil",
    href: "/",
  },
  {
    key: "chat-playground",
    englishLabel: "Chat playground",
    frenchLabel: "Aire de jeux pour discuter",
    href: "/chat",
  },
  {
    key: "image-generation",
    englishLabel: "Image generation",
    frenchLabel: "Génération d'images",
    href: "/image-generation",
  },
];

describe("Checks top panel content", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Checks each link in the desktop main menu has the expected text and leads to the expected page", () => {
    mainMenu.forEach((item) => {
      cy.dataCy(`desktop-navbar-${item.key}`)
        .should("have.attr", "href", item.href)
        .should("have.text", item.englishLabel);
      // click on the link
      cy.dataCy(`desktop-navbar-${item.key}`).click();

      // check if the login page is loaded
      cy.url().should("include", item.href);
    });
  });
});
