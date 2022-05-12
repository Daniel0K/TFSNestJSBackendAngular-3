FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY /usr/src/app/dist/ ./dist

CMD ["node", "dist/main"]
