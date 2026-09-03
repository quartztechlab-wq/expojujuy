# ExpoJuy 2026 — sitio estático (Vite) servido por Caddy.
# Etapa 1: build de producción → dist/
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Etapa 2: servidor estático. No publica puertos al host: lo alcanza el Caddy
# de borde (turismo-caddy) por la red docker "edge" en el puerto 80 interno.
FROM caddy:2-alpine
COPY deploy/Caddyfile.static /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
