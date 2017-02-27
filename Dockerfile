FROM node:6.10.0-alpine

WORKDIR /frontend

COPY package.json package.json
RUN npm install

COPY . .
RUN npm run tsc; exit 0 && \
    grunt build

VOLUME /frontend
