// apps/processor-node/src/storage.ts
import os from 'os';
import path from 'path';
import { Storage } from '@google-cloud/storage';
import { Firestore, FieldValue } from '@google-cloud/firestore';

const bucketName = process.env.GCS_BUCKET!;
const storage = new Storage();
const bucket = storage.bucket(bucketName);
const firestore = new Firestore();

/** Download audio and cover into tmp directory */
export async function downloadSources(jobId: string): Promise<{ audioPath: string; coverPath: string }> {
    const tmpDir = os.tmpdir();
    const audioPath = path.join(tmpDir, `${jobId}-audio.mp3`);
    const coverPath = path.join(tmpDir, `${jobId}-cover.jpg`);
    await bucket.file(`uploads/${jobId}/audio.mp3`).download({ destination: audioPath });
    await bucket.file(`uploads/${jobId}/cover.jpg`).download({ destination: coverPath });
    return { audioPath, coverPath };
}

/** Upload the rendered video and return its public URL */
export async function uploadResult(jobId: string, outputPath: string): Promise<string> {
    const destination = `outputs/${jobId}/video.mp4`;
    await bucket.upload(outputPath, { destination, contentType: 'video/mp4' });
    const file = bucket.file(destination);
    await file.makePublic();
    return `https://storage.googleapis.com/${bucketName}/${destination}`;
}

/** Update job status in Firestore */
export async function updateJobStatus(jobId: string, status: 'processing' | 'done', videoUrl?: string): Promise<void> {
    const docRef = firestore.collection('jobs').doc(jobId);
    const data: any = { status, updatedAt: FieldValue.serverTimestamp() };
    if (videoUrl) data.videoURL = videoUrl;
    await docRef.update(data);
}

/** Get job settings from Firestore */
export async function getJobSettings(jobId: string): Promise<any> {
    const doc = await firestore.collection('jobs').doc(jobId).get();
    return doc.data()?.settings;
}
