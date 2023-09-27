FROM node:18-alpine

RUN mkdir app
COPY ../prisma ./app
COPY ../package.json ./app
WORKDIR /app

RUN npm install --loglevel verbose
RUN npm install next -g

CMD ["npm", "run", "dev"]