FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x node_modules/.bin/react-scripts

RUN npm run build

RUN npm install -g serve
CMD ["serve", "-s", "build"]

EXPOSE 3001