# ──────────────────────────────── Base ────────────────────────────────── #
FROM python:3.10-slim

# ───────────────────────────── ffmpeg ───────────────────────────────── #
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# ─────────────────────────────── Workdir ────────────────────────────── #
WORKDIR /app

# ─────────────────────────── Dependencies ───────────────────────────── #
# Сначала копируем только requirements — чтобы слои кешировались
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────── Sources ────────────────────────────── #
# Копируем сам код (renderer.py, storage.py, app.py и т.д.)
COPY src/ ./src/
# Если у вас в корне ещё есть .env или другие файлы — тоже их можно скопировать:
# COPY .env ./

# ───────────────────────── Environment ─────────────────────────────── #
# Имя bucket-а передаётся извне, но можно задать дефолт
ENV GCS_BUCKET=visualizationmaker-b8ff1.appspot.com
# Flask слушает на 8080
ENV PORT=8080

# ──────────────────────────── Entrypoint ──────────────────────────── #
# Устанавливаем рабочую папку и запускаем Gunicorn
#   –w 1: один воркер (moviepy жрёт CPU/RAM, не многопоточный)
#   --threads 2: пара потоков для обработки HTTP
#   bind 0.0.0.0:8080: слушаем внешний порт
CMD ["gunicorn", "-w", "1", "--threads", "2", "-b", "0.0.0.0:8080", "src.app:app"]
