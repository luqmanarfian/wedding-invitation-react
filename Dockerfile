# ==========================================
# Stage 1: Build Stage (Node.js Environment)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Salin package.json & package-lock.json terlebih dahulu untuk memanfaatkan cache layer Docker
COPY package.json package-lock.json ./

# Install dependensi secara bersih (clean install)
RUN npm ci

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Build aplikasi React (output akan berada di folder /app/dist)
RUN npm run build

# ==========================================
# Stage 2: Production Stage (Nginx Unprivileged Web Server)
# ==========================================
FROM nginxinc/nginx-unprivileged:1.25-alpine

# Salin hasil build (folder dist) dari stage sebelumnya ke direktori HTML Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Salin konfigurasi kustom Nginx untuk menangani routing SPA React (Vite)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port non-privileged web server (default untuk nginx-unprivileged adalah 8080)
EXPOSE 8080

# Jalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
