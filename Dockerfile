FROM node:6.10.0-alpine
MAINTAINER Bulat Khasanov <afti@yandex.ru>

WORKDIR /frontend

COPY . .

RUN npm install --global grunt && \
    yarn

RUN npm run tsc; exit 0
RUN grunt build

VOLUME /frontend
