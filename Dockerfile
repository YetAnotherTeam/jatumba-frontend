FROM mkenney/npm:alpine

WORKDIR /frontend
ADD . .
RUN npm install && \
    npm run tsc:w && \
    grunt build

VOLUME /frontend
