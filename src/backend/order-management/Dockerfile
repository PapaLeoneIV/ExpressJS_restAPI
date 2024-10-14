# Simple Dockerfile to build the image for a node.js application development environment
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [npx, tsx, src/index.ts]