FROM node:18-alpine

RUN mkdir app

COPY ../prisma ./app
COPY ../package.json ./app
COPY ../package-lock.json ./app
WORKDIR /app

RUN npm ci
RUN npm install next -g

CMD ["npm", "run", "dev"]