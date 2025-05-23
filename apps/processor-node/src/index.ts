import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { downloadSources, uploadResult, updateJobStatus, getJobSettings } from './storage'
import { render } from './renderer'
import Logger from './utils/logger'

const app = express()
app.use(bodyParser.json())

const PORT = process.env.PORT || 8080

app.post('/', async (req: Request, res: Response) => {
	const envelope = req.body

	const msg = envelope.message
	if (!msg || !msg.data) {
		return res.status(400).send('No Pub/Sub message received')
	}

	const data = JSON.parse(Buffer.from(msg.data, 'base64').toString())
	Logger.debug('INDEX : Receive data', { data })

	const jobId: string = data.jobId
	if (!jobId) {
		return res.status(400).send('Missing jobId in message')
	}
	Logger.debug(`INDEX : Got new job. jobId=${jobId}`)

	await updateJobStatus(jobId, 'received_processor')

	res.status(204).json({ status: 'received_processor', jobId })

	setTimeout((async () => {
		try {
			Logger.debug('INDEX : working in async')

			// 1. Get settings and mark processing
			const settings = await getJobSettings(jobId)
			if (!settings) throw new Error(
                `Settings for job ${jobId} not found`
			)
			Logger.debug('INDEX : Settings', settings)

			await updateJobStatus(jobId, 'preparing_data')

			// 2. Download sources
			const { audioPath, coverPath } = await downloadSources(jobId)
			Logger.debug(`INDEX : Find audioPath : ${audioPath}`)
			Logger.debug(`INDEX : Find coverPath : ${coverPath}`)
			if (!audioPath || !coverPath) throw new Error(
                `Audio or cover not found for job ${jobId}`
			)

			await updateJobStatus(jobId, 'before_processing')

			// 3. Render video
			const outPath = `/tmp/${jobId}-out.mp4`
			Logger.debug(`INDEX : Find outPath = ${outPath}`)
			await updateJobStatus(jobId, 'processing')
			await render(audioPath, coverPath, outPath, settings, jobId)

			await updateJobStatus(jobId, 'uploading')

			// 4. Upload result
			const videoUrl = await uploadResult(jobId, outPath)
			Logger.debug(`INDEX : Video created. videoUrl = ${videoUrl}`)
			if (!videoUrl) throw new Error('Video URL not found')

			// 5. Finalize job
			await updateJobStatus(jobId, 'done', videoUrl)
		} catch (err) {
			Logger.error('INDEX : Processor error:', err)
			await updateJobStatus(jobId, 'error')
		}
	}))

	return ''
})

app.listen(PORT, () => {
	Logger.info(`Processor service listening on port ${PORT}`)
})
