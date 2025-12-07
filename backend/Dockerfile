FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY ./package.json ./

RUN npm install

RUN npm install -g @nestjs/cli

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
