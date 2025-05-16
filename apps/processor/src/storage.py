import os
import tempfile
from google.cloud import storage, firestore

# Инициализация клиента (в app.py переменные окружения должны быть выставлены)
bucket_name = os.getenv("GCS_BUCKET")
storage_client = storage.Client()
bucket = storage_client.bucket(bucket_name)
firestore_client = firestore.Client()


def download_sources(job_id: str, tmp_dir: str) -> (str, str):
    """
    Скачивает audio.mp3 и cover.jpg в папку tmp_dir, возвращает пути.
    """
    audio_blob = bucket.blob(f"uploads/{job_id}/audio.mp3")
    cover_blob = bucket.blob(f"uploads/{job_id}/cover.jpg")
    audio_path = os.path.join(tmp_dir, "audio.mp3")
    cover_path = os.path.join(tmp_dir, "cover.jpg")
    audio_blob.download_to_filename(audio_path)
    cover_blob.download_to_filename(cover_path)
    return audio_path, cover_path


def upload_result(job_id: str, output_path: str) -> str:
    """
    Загружает видео, делает его публичным (или можно генерить signed URL) и возвращает URL.
    """
    dest_blob = bucket.blob(f"outputs/{job_id}/video.mp4")
    dest_blob.upload_from_filename(output_path, content_type="video/mp4")
    dest_blob.make_public()
    return dest_blob.public_url


def update_job_status(job_id: str, status: str, video_url: str = None):
    """
    Обновляет документ jobs/{job_id} в Firestore.
    """
    doc_ref = firestore_client.collection("jobs").document(job_id)
    data = {"status": status}
    if video_url:
        data["videoURL"] = video_url
    doc_ref.update(data)