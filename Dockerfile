FROM node:16.15.0
ENV NODE_ENV=production
EXPOSE 9000

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install express
RUN npm install

COPY . .

CMD [ "node", "server.js" ]