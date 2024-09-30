FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# RUN npm install --save-dev @types/zod

# TODO_TEST: Check if in development mode is necessary since I heve the bind mount 
COPY . .

# TODO_PROD: uncomment this line to build the app
# RUN npm run build

EXPOSE 3001

# TODO_PROD: update the CMD to run the built app
CMD [npx, tsx, src/index.ts]
# CMD [npm, start]
