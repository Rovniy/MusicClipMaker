FROM node:22-slim

# ─────────── Устанавливаем ffmpeg ───────────
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# ─────────── Рабочая директория ───────────
WORKDIR /app

# ─── Копируем манифесты, ставим зависимости ───
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

# ─────────── Копируем исходники ───────────
COPY src/ ./src/

# ─── Компилируем TypeScript в dist/ ───
RUN npm run build

# ─── Открываем порт, задаём ENV ───
EXPOSE 8080

ENV GCS_BUCKET=visualizationmaker-b8ff1.appspot.com
ENV PORT=8080
ENV LOGGER_LEVEL=DEBUG
ENV LOG_NAME=PROCESSOR_NODE

# ─── Запуск готового JS ───
CMD ["node", "lib/index.js"]
