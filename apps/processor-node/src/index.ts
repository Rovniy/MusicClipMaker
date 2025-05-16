// apps/processor-node/src/index.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { downloadSources, uploadResult, updateJobStatus, getJobSettings } from './storage';
import { render } from './renderer';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

app.post('/', async (req: Request, res: Response) => {
    try {
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

        // 1. Get settings and mark processing
        const settings = await getJobSettings(jobId);
        await updateJobStatus(jobId, 'processing');

        // 2. Download sources
        const { audioPath, coverPath } = await downloadSources(jobId);

        // 3. Render video
        const outPath = `/tmp/${jobId}-out.mp4`;
        await render(audioPath, coverPath, outPath, settings);

        // 4. Upload result
        const videoUrl = await uploadResult(jobId, outPath);

        // 5. Finalize job
        await updateJobStatus(jobId, 'done', videoUrl);

        return res.status(204).send();
    } catch (err: unknown) {
        console.error('Processor error:', err);
        return res.status(500).send((err instanceof Error) ? err.message : 'Internal Error');
    }
});

app.listen(PORT, () => {
    console.log(`Processor service listening on port ${PORT}`);
});
