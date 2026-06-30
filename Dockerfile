FROM node:22-alpine

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy and build client
COPY client/ ./client/
RUN cd client && npm install && npm run build

# Copy server source
COPY server ./server

EXPOSE 5000

CMD ["node", "server/index.js"]
