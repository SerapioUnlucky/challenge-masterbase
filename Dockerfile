FROM node:20

RUN mkdir -p /home/auth-app

WORKDIR /home/auth-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]