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
		const filters = [
			// 1) scale the cover
			{
				filter: 'scale',
				options: settings.format === '9:16' ? '480:854' : '720:720',
				inputs: '0:v',
				outputs: 'bg'
			},
			// 2) build waveform
			{
				filter: 'showwaves',
				options: {
					s: settings.format === '9:16' ? '480x200' : '720x400',
					mode: 'cline',
					colors: 'white'
				},
				inputs: '1:a',
				outputs: 'wave'
			},
			// 3) overlay the waveform on the background
			{
				filter: 'overlay',
				options: { y: 'h-200-20', format: 'auto' },
				inputs: ['bg','wave']
			}
		];

		const command = ffmpeg()
			.setFfmpegPath(ffmpegStatic)
			.input(coverPath)
			.inputOption(
				settings.duration === 8
					? [ '-loop 1', `-t ${settings.duration}` ]
					: [ '-loop 1' ]
			)
			.input(audioPath)
			.complexFilter(filters)
			.outputOptions([
				'-c:v libx264',
				'-preset ultrafast',
				'-threads 8',
				'-r 15',
				'-c:a aac',
				'-shortest'
			])
			.output(outputPath)
			.on('start', cmdLine => Logger.debug('RENDERER : FFmpeg command:', { cmdLine }))
			.on('stderr', stderrLine => Logger.debug('RENDERER : FFmpeg stderr:', { stderrLine }))
			.on('progress', p => {
				const percent = Math.min(100, Math.floor(p.percent || 0))
				updateJobProgress(jobId, percent).catch(Logger.error)
			})
			.on('error', (err, stdout, stderr) => {
				Logger.error('RENDERER : ✖ FFmpeg failed:', { message: err.message })
				Logger.error('RENDERER : ffmpeg stdout:', { stdout })
				Logger.error('RENDERER : ffmpeg stderr:', { stderr })
				reject(err)
			})
			.on('end', () => {
				Logger.info('RENDERER : ✔ FFmpeg finished')
				resolve()
			})

		command.run()
	})
}
