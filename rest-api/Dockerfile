FROM node:12.14.0-alpine3.10

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY serverless.yml handler.js ./
COPY src src

CMD npm start