FROM node:20-alpine3.19 AS development

ENV NPM_CONFIG_LOGLEVEL=error

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./


RUN npm install

COPY ./apps/users ./apps/users
COPY ./libs ./libs

RUN ./node_modules/.bin/nest build users

FROM node:20-alpine3.19 AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install --production=false

COPY ./apps/users ./apps/users
COPY ./libs ./libs


RUN ./node_modules/.bin/nest build users

