FROM node:14-alpine
ADD yarn.lock package.json ./
RUN yarn --ignore-scripts
ADD ./ ./
RUN yarn build
ENTRYPOINT ["node", "./bin/run"]
