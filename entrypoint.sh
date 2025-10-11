#!/bin/sh

cd /app/backend/build
node ace migration:run --force
node ace db:seed
PORT=3333 node server.js &

cd /app/frontend
PORT=3000 node .output/server/index.mjs &

caddy run --config /app/Caddyfile
