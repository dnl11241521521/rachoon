FROM zenika/alpine-chrome 

USER root

RUN apk add --no-cache --update nodejs npm graphicsmagick ghostscript caddy

WORKDIR /app
COPY ./Caddyfile .
COPY ./entrypoint.sh .

RUN npm install -g pnpm
RUN mkdir -p /app/frontend
RUN mkdir -p /app/backend/apps/backend

COPY ./apps/frontend/.output /app/frontend

COPY ./apps/backend/build /app/backend/apps/backend
COPY ./packages /app/backend/packages
COPY ./package.json /app/backend/
COPY ./pnpm-workspace.yaml /app/backend/

WORKDIR /app/backend/apps/backend
RUN pnpm install --prod --force


WORKDIR /app

ENTRYPOINT ["./entrypoint.sh"]
