FROM node:6.10.0-alpine

WORKDIR /frontend

COPY . .

RUN npm install --global yarn grunt && \
    yarn

RUN npm run tsc; exit 0
RUN grunt build

VOLUME /frontend
