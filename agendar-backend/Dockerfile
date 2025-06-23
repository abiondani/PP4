FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG API_ENCUESTA
ENV API_ENCUESTA=$API_ENCUESTA

EXPOSE 3000

CMD ["npm", "start"]