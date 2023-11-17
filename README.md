## Overview

This web app is designed to empower students with playground for prompt engineering using the OpenAI platform.

Developed in collaboration with [CyberCap](https//cybercap.qc.ca/), a non-profit organization focused on the well-being of young people, the project aims to contribute to their social and professional integration into society.

## Key Features

- **Chat with AI Bot** Users can engage in conversations with an AI bot and the chat history is saved to a database.
- **Image Generation** The app sends prompts to the OpenAI platform to generate images, which are then saved to a Vercel bucket.

## Tech Stack

- **Next.js**
- **React.js**
- **Typescript**
- **Tailwind CSS**
- **OpenAI API**
- **Vercel AI SDK**
- **Shadcn/ui**
- **NextAuth.js**
- **tRPC**
- **Zod**
- **React Hook Form**
- **Prisma ORM**
- **PostgreSQL**
- **Vercel Blob Storage**
- **i18next**
- **GitHub Actions**
- **Cypress**

## Authentication

Implemented authentication with Google and Microsoft using NextAuth.js to provide a secure and seamless user experience.

## Database

The database is modeled using Prisma ORM with PostgreSQL as the chosen database to ensure robust data management.

## Localization

The app supports two languages, English and French, to enhance accessibility for a broader audience. i18next is employed for seamless implementation of localization.

## CI/CD Implementation

Three workflows are implemented for continuous integration and deployment

1. **Testing with Cypress** Ensures the reliability of the application through end-to-end tests.
2. **Preview on Vercel** Provides a preview of the app on Vercel for testing before deployment to production.
3. **Deployment to Production** Automatically deploys the app to production on Vercel after successful testing and preview.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

- **DATABASE_URL** - The URL of the PostgreSQL database
- **NEXTAUTH_SECRET** - A secret string used to encrypt the session
- **NEXTAUTH_URL** - The URL of the app
- **OPENAI_API_KEY** - The API key for the [OpenAI platform](https://platform.openai.com/docs/introduction)

- **AZURE_AD_CLIENT_ID**, **AZURE_AD_CLIENT_SECRET**, **AZURE_AD_TENANT_ID** - The client ID, client secret, and tenant ID for the Microsoft app. More about this [here](https://next-auth.js.org/providers/azure-ad)
- **GOOGLE_CLIENT_ID**, **GOOGLE_CLIENT_SECRET** - The client secret for the Google app. More about this [here](https://next-auth.js.org/providers/google)
- **ACT** - A boolean value to run the workflow locally. [GitHub repo](https://github.com/nektos/act)
- **ROLLBAR_PUBLIC_CLIENT_TOKEN**, **ROLLBAR_SERVER_TOKEN** - The server token for [Rollbar](https://rollbar.com)
