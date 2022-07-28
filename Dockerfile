FROM node:17

WORKDIR /user-session
COPY . .

RUN npm install
RUN npm install nodemon -g

EXPOSE 5000

ENTRYPOINT ["nodemon", "index.js"]
