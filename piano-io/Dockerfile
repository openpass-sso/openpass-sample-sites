FROM node:20.19.4@sha256:2c071012e93673d595e1399564c4a48a70a5c0a0acd7db8211d5e6f6316b431a
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm","run","server"]
