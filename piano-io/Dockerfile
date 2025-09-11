FROM node:20.19.5@sha256:abcf9c98af22ea2c5d33435143d9d8a5f6f191e1e1938a7650fc8b78c382b5a9
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm","run","server"]
