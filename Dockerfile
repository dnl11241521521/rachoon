FROM zenika/alpine-chrome 

USER root

RUN apk add --no-cache --update nodejs npm graphicsmagick ghostscript caddy

WORKDIR /app
RUN npm install -g pnpm@latest nuxt@3
COPY . .
RUN pnpm install 
RUN pnpm run build
RUN cd /app/apps/backend
RUN pnpm install -P --frozen-lockfile --force
RUN cd /app
RUN mkdir -p /app/dist/frontend
RUN mkdir -p /app/dist/backend
RUN mv /app/apps/frontend/.output/* /app/dist/frontend/
RUN mv /app/apps/backend/build/* /app/dist/backend/
RUN rm -rf /app/apps
RUN rm -rf /app/packages
ENTRYPOINT ["./entrypoint.sh"]
