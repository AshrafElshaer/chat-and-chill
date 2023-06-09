FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run primsa:migrate

RUN npm run prisma:generate

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]



