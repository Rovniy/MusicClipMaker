# apps/processor/src/app.py
"""
Flask-сервис: получает Pub/Sub push, обрабатывает задачу и завершает.
"""
import os
import json
import base64
import tempfile
from flask import Flask, request, abort
from renderer import render_video
from storage import download_sources, upload_result, update_job_status

app = Flask(__name__)

@app.route('/', methods=['POST'])
def handle_pubsub():
    envelope = request.get_json(force=True)
    msg = envelope.get('message')
    if not msg or 'data' not in msg:
        abort(400, 'No Pub/Sub message')

    payload = json.loads(base64.b64decode(msg['data']).decode())
    job_id = payload.get('jobId')
    if not job_id:
        abort(400, 'Missing jobId')

    # временная директория
    tmp = tempfile.mkdtemp()
    audio_path, cover_path = download_sources(job_id, tmp)

    # получаем настройки из Firestore
    from google.cloud import firestore
    fs = firestore.Client()
    job = fs.collection('jobs').document(job_id).get().to_dict() or {}
    force_8 = job.get('settings', {}).get('duration') == 8

    # рендер
    out_path = os.path.join(tmp, 'out.mp4')
    render_video(audio_path, cover_path, out_path, force_8)

    # загрузка и обновление статуса
    video_url = upload_result(job_id, out_path)
    update_job_status(job_id, 'done', video_url)

    return ('', 204)

if __name__ == '__main__':
    os.environ.setdefault('GCS_BUCKET', 'visualizationmaker-b8ff1.appspot.com')
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 8080)))