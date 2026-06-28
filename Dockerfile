FROM node:22-alpine

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install

COPY client/package*.json ./client/
RUN cd client && npm install && npm run build

COPY server ./server
COPY client ./client

EXPOSE 5000

CMD ["node", "server/index.js"]
