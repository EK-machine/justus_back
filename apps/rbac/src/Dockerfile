FROM node:20-alpine3.19 AS development

ENV NPM_CONFIG_LOGLEVEL=error

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./


RUN npm install

COPY ./apps/rbac ./apps/rbac
COPY ./libs ./libs

RUN ./node_modules/.bin/nest build rbac

FROM node:20-alpine3.19 AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install --production=false

COPY ./apps/rbac ./apps/rbac
COPY ./libs ./libs


RUN ./node_modules/.bin/nest build rbac

