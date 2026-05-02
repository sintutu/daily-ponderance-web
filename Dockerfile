FROM node:22-alpine AS build

WORKDIR /app
COPY src/web/package*.json ./src/web/
RUN cd src/web && npm ci

COPY src/web ./src/web
RUN cd src/web && npm run build

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/src/web/dist /usr/share/nginx/html

EXPOSE 80
