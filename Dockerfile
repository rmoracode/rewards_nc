# ── Stage 1: compile JSX → JS ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

# Install dependencies (Babel core + React preset)
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy source files needed for the build
COPY build.js        ./
COPY lib/            ./lib/
COPY assets/         ./assets/
COPY admin-views.jsx     ./
COPY admin-app.jsx       ./
COPY vendedor-views.jsx  ./
COPY vendedor-app.jsx    ./
COPY dashboard-admin.html    ./
COPY dashboard-vendedor.html ./

# Transpile JSX → plain JS and assemble dist/
RUN node build.js

# ── Stage 2: serve compiled files with Nginx ─────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY deploy/nginx.conf /etc/nginx/conf.d/

# Copy compiled app from builder stage
COPY --from=builder /build/dist /app

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
