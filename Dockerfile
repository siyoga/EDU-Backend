FROM node:16.15-alpine

WORKDIR /server

COPY package*.json ./
COPY config.ts ./
COPY yarn.lock ./
COPY settings.env ./
COPY tsconfig.json ./
COPY src/ ./src

RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["node", "dist/src/index.js"]