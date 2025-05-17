// apps/processor-node/src/storage.ts
import os from 'os';
import path from 'path';
import fs from 'fs';
import { Storage } from '@google-cloud/storage';
import { Firestore, FieldValue } from '@google-cloud/firestore';
import Logger from "./utils/logger";

const bucketName = process.env.GCS_BUCKET!;
const storage = new Storage();
const bucket = storage.bucket(bucketName);
const firestore = new Firestore();

type TJobStatus = 'processing'
    | 'done'
    | 'error'
    | 'received_processor'
    | 'preparing_data'
    | 'before_processing'
    | 'uploading'

async function downloadFile(src: string, dest: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        const readStream = bucket.file(src).createReadStream();
        const writeStream = fs.createWriteStream(dest);
        readStream
            .on('error', reject)
            .pipe(writeStream)
            .on('error', reject)
            .on('finish', resolve)
    });
}

/** Download audio and cover into tmp directory */
export async function downloadSources(jobId: string): Promise<{ audioPath: string; coverPath: string }> {
    const tmpDir = os.tmpdir();
    const audioPath = path.join(tmpDir, `${jobId}-audio.mp3`);
    const coverPath = path.join(tmpDir, `${jobId}-cover.jpeg`);

    await Promise.all([
        downloadFile(`uploads/${jobId}/audio.mp3`, audioPath),
        downloadFile(`uploads/${jobId}/cover.jpeg`, coverPath)
    ]);

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
export async function updateJobStatus(jobId: string, status: TJobStatus, videoUrl?: string): Promise<void> {
    const docRef = firestore.collection('jobs').doc(jobId);
    const data: any = { status, updatedAt: FieldValue.serverTimestamp() };

    if (videoUrl) data.videoURL = videoUrl;

    Logger.debug('updateJobStatus : jobId=', jobId, 'status=', status);

    await docRef.update(data);
}

/** Get job settings from Firestore */
export async function getJobSettings(jobId: string): Promise<any> {
    const doc = await firestore.collection('jobs').doc(jobId).get();
    return doc.data()?.settings;
}

export async function updateJobProgress(jobId: string, progress: number) {
    await firestore
        .doc(`jobs/${jobId}`)
        .set({ progress, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}