# Mirai Solutions website — zero-dependency Node server
FROM node:22-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY . .
EXPOSE 3000
USER node
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "server.mjs"]
