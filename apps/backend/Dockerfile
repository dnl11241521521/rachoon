FROM node:18 as builder
WORKDIR /app

COPY package.json .
RUN npm install
COPY . . 
RUN npm run build


FROM zenika/alpine-chrome

LABEL maintainer="Adis Durakovic <adis.durakovic@gmail.com>"
USER root

RUN apk add --no-cache --update \
     nodejs npm graphicsmagick ghostscript

WORKDIR /app

COPY --from=builder /app/build .
COPY startup.sh .
ENTRYPOINT ["sh", "startup.sh"]
