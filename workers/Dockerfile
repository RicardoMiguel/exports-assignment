FROM node:12.14.0-alpine3.10

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY index.js ./
COPY src src

CMD npm start