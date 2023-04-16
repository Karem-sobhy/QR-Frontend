# Stage 1: build the Vue app
FROM node:latest AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: serve the Vue app with Nginx
FROM nginx:latest

# Copy Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]