FROM node:16

WORKDIR /user-session

COPY ["./package.json", "."]

RUN npm install
RUN npm install nodemon -g

EXPOSE 5000

ENTRYPOINT ["nodemon", "./src/index.js"]
