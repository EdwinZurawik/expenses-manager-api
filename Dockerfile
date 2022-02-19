FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i && npm i nodemon -g

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]