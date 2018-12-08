FROM node:10-alpine

ARG NODE_ENV=production
ARG PORT=3000
ENV NODE_ENV $NODE_ENV
ENV PORT $PORT

WORKDIR /opt

RUN apk --no-cache add --virtual builds-deps \
    build-base \
    python
COPY package.json package-lock.json ./
RUN npm install && \
    npm cache clean --force && \
    npm rebuild bcrypt --build-from-source && \
    apk del builds-deps
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

EXPOSE $PORT

CMD ["node", "src/server.js"]
