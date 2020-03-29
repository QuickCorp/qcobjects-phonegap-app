FROM quickcorp/qcobjects:latest

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY ./package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV PORT_HTTP 80
ENV PORT_HTTPS 443

EXPOSE $PORT_HTTP
EXPOSE $PORT_HTTPS
CMD [ "npm", "start" ]
