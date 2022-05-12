FROM node:lts-alpine

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY dist/ ./dist

CMD ["node", "dist/main"]