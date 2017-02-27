FROM mkenney/npm:alpine

WORKDIR /frontend

COPY package.json package.json
RUN npm install
COPY . .
RUN npm run tsc:w && \
    grunt build

VOLUME /frontend
