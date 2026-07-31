FROM node:22-alpine

WORKDIR /app

# Copiamos primero los manifiestos: si no cambian, Docker reusa la capa de deps.
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

USER node
CMD ["node", "src/server.js"]
