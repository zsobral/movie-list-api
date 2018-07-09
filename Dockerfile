FROM node:10-alpine

ARG NODE_ENV=production
ARG PORT=3000

ENV NODE_ENV $NODE_ENV
ENV PORT $PORT

WORKDIR /opt

COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

EXPOSE $PORT

CMD ["node", "src/server.js"]
