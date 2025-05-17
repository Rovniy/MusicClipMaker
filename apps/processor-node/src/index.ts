import dotenv from 'dotenv';
dotenv.config()

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { downloadSources, uploadResult, updateJobStatus, getJobSettings } from './storage';
import { render } from './renderer';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

app.post('/', async (req: Request, res: Response) => {
    const envelope = req.body;

    const msg = envelope.message;
    if (!msg || !msg.data) {
        return res.status(400).send('No Pub/Sub message received');
    }

    const data = JSON.parse(Buffer.from(msg.data, 'base64').toString());

    const jobId: string = data.jobId;
    if (!jobId) {
        return res.status(400).send('Missing jobId in message');
    }

    console.log('jobId', jobId);

    res.sendStatus(204).json({ status: 'processing', jobId });

    return (async () => {
        try {
            // 1. Get settings and mark processing
            const settings = await getJobSettings(jobId);
            if (!settings) throw new Error(
                `Settings for job ${jobId} not found`
            )
            console.log('settings', settings);

            await updateJobStatus(jobId, 'processing');

            // 2. Download sources
            const {audioPath, coverPath} = await downloadSources(jobId);
            console.log('audioPath', audioPath);
            console.log('coverPath', coverPath);
            if (!audioPath || !coverPath) throw new Error(
                `Audio or cover not found for job ${jobId}`
            )

            // 3. Render video
            const outPath = `/tmp/${jobId}-out.mp4`;
            console.log('outPath', outPath);
            await render(audioPath, coverPath, outPath, settings, jobId);

            // 4. Upload result
            const videoUrl = await uploadResult(jobId, outPath);
            console.log('videoUrl', videoUrl);
            if (!videoUrl) throw new Error('Video URL not found')

            // 5. Finalize job
            return updateJobStatus(jobId, 'done', videoUrl);
        } catch (err) {
            console.error('Processor error:', err);

            await updateJobStatus(jobId, 'error');
            return;
        }
    })()
});

app.listen(PORT, () => {
    console.log(`Processor service listening on port ${PORT}`);
});
