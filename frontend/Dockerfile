FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY ./package.json ./

RUN npm install

RUN npm install -g next

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
