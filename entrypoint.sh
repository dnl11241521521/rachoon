#!/bin/sh

cd /app/backend/apps/backend || exit

export PORT=3333
export NODE_ENV=production

node ace migration:run --force
node ace db:seed
node server.js &

cd /app/frontend || exit
PORT=3000 node ./server/index.mjs &

caddy run --config /app/Caddyfile
