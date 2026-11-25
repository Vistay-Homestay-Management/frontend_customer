FROM node:24-alpine AS build
WORKDIR /workspace
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine
ENV PORT=8080
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --chmod=755 runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
USER root
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-runtime-config.sh \
    && chmod 755 /docker-entrypoint.d/40-runtime-config.sh
USER 101
COPY --from=build /workspace/dist /usr/share/nginx/html
EXPOSE 8080
