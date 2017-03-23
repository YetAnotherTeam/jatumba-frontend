FROM node:6.10.0-alpine
MAINTAINER Bulat Khasanov <afti@yandex.ru>

WORKDIR /frontend

COPY package.json yarn.lock typings.json ./

RUN npm install --global grunt && \
    yarn

COPY . .

RUN npm run tsc; exit 0
RUN grunt build

VOLUME /frontend
