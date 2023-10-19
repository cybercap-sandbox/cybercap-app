import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    //set 20 seconds for working with slow or emulated environment
    defaultCommandTimeout: 20000,
  },
});
