FROM node:18-alpine

WORKDIR /app
COPY prisma ./
COPY package.json ./

RUN npm install

COPY . .
RUN npx prisma generate
CMD ["npm", "run", "dev"]