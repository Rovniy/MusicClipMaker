// apps/processor-node/src/renderer.ts
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { updateJobProgress } from './storage'
import Logger from './utils/logger'

export interface RenderSettings {
    duration: number | 'full';
    format: '9:16' | '1:1' | '16:9';
    theme: string;
    mute: boolean;
    title?: string;
    artist?: string;
}

export function render(
	audioPath: string,
	coverPath: string,
	outputPath: string,
	settings: RenderSettings,
	jobId: string
): Promise<void> {
	return new Promise((resolve, reject) => {
		const command = ffmpeg()
			.setFfmpegPath(ffmpegStatic)
			.input(coverPath)
			.inputOption(
				settings.duration === 8
					? [ '-loop 1', `-t ${settings.duration}` ]
					: [ '-loop 1' ]
			)
			.input(audioPath)
			.videoFilters(`scale=${settings.format === '9:16' ? '480:854' : '720:720'}`)
			.complexFilter([
				{
					filter: 'showwaves',
					options: {
						s: '480x200',
						mode: 'cline',
						colors: 'white'
					},
					inputs: '1:a',
					outputs: 'wave'
				},
				{
					filter: 'overlay',
					options: { y: '1520', format: 'auto' },
					inputs: [ '0:v', 'wave' ]
				}
			])
			.outputOptions([
				'-c:v libx264',
				'-preset ultrafast',
				'-threads 8',
				'-r 15',
				'-c:a aac',
				'-shortest'
			])
			.output(outputPath)
			.on('start', cmdLine => Logger.debug('FFmpeg command:', cmdLine))
			.on('stderr', stderrLine => Logger.debug('FFmpeg stderr:', stderrLine))
			.on('progress', p => {
				const percent = Math.min(100, Math.floor(p.percent || 0))
				updateJobProgress(jobId, percent).catch(Logger.error)
			})
			.on('error', (err, stdout, stderr) => {
				Logger.error('✖ FFmpeg failed:', err.message)
				Logger.error('ffmpeg stdout:', stdout)
				Logger.error('ffmpeg stderr:', stderr)
				reject(err)
			})
			.on('end', () => {
				Logger.info('✔ FFmpeg finished')
				resolve()
			})

		command.run()
	})
}
