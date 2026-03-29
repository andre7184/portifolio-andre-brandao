# Estágio 1: Build (Transforma o código React em arquivos estáticos)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor (Usa o Nginx para entregar os arquivos prontos)
FROM nginx:stable-alpine
# Copia o resultado do build anterior para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração customizada para o Nginx suportar Single Page Application (SPA)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]