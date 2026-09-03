FROM node:20.19.5@sha256:ba36e9b2705008e63e354214f0e3011c528af9df2ca13ac2bd2c0114650302e6
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm","run","server"]
