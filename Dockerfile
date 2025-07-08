# --- Build Stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy built app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config (for TLS, see below)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose HTTP (80) and HTTPS (443)
EXPOSE 80 443

# --- TLS/SSL Setup ---
# To enable HTTPS, you need to provide your own TLS certificate and key.
# Example (in your project root):
#   /certs/fullchain.pem
#   /certs/privkey.pem
# Then mount them into the container and reference in nginx.conf.
# Example docker run:
#   docker run -v $(pwd)/certs:/etc/nginx/certs ...
#
# You CANNOT generate a real TLS certificate in the Dockerfile (requires domain validation).
# Use Let's Encrypt (Certbot) or your CA to generate certs, then mount them.

CMD ["nginx", "-g", "daemon off;"] 