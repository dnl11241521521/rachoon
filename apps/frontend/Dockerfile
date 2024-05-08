FROM node:18 as builder
WORKDIR /app
COPY package.json .
RUN npm install --force
COPY . .
RUN npm run generate:production


FROM socialengine/nginx-spa:latest
COPY --from=builder /app/.output/public /app
RUN chmod -R 777 /app