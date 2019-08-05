# Client App
FROM node:12.7.0-alpine as client-app
USER node
LABEL authors="Eprel"
RUN mkdir /home/node/.npm-global ; \
  mkdir -p /home/node/app ; \
  chown -R node:node /home/node/app ; \
  chown -R node:node /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
RUN npm install --silent --no-progress -g yarn@latest
RUN npm install --silent --no-progress -g @angular/cli@8.2.0
WORKDIR /home/node/app
COPY ["package.json", "./"]
RUN yarn install --silent
COPY . .
RUN ng build --prod --build-optimizer
RUN npm cache clean --force

# Node server
FROM node:12.7.0-alpine as node-server
WORKDIR /usr/src/app
COPY ["./server/package.json", "./"]
RUN yarn install --production && mv node_modules ../
COPY ./server /usr/src/app

# Final image
FROM node:12.7.0-alpine
WORKDIR /usr/src/app
COPY --from=node-server /usr/src /usr/src
COPY --from=client-app /home/node/app /usr/src
EXPOSE 80
CMD ["node", "app"]
