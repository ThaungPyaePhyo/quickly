FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["node", "dist/main"]
