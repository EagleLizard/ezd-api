
FROM node:22-alpine

ENV TZ="America/Denver"
ENV USER=node
ENV HOME=/home/$USER
ENV APP_DIR=app

RUN mkdir -p ${HOME}/${APP_DIR}/node_modules
RUN chown -R node:node ${HOME}/${APP_DIR}
WORKDIR ${HOME}/${APP_DIR}

COPY package.json .
COPY package-lock.json .
COPY src/ src
COPY tsconfig.json .
COPY .eslintrc.js .
RUN npm ci
RUN npm run build
RUN npm ci --omit=dev

EXPOSE ${EZD_PORT}

CMD [ "node", "dist/main.js" ]
