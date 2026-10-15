
# ---- deps stage (все зависимости, включая dev — нужен typescript для сборки) ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ---- build stage ----
FROM deps AS build
WORKDIR /app
COPY . .
# Компилируем в dist согласно outDir из tsconfig.json
RUN npx tsc

# ---- prod deps stage (только production-зависимости) ----
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# ---- runtime stage ----
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
ARG PORT=4300
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]