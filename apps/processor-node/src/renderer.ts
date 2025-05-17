// apps/processor-node/src/renderer.ts
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { updateJobProgress } from './storage';

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
            // на вход: обложка
            .input(coverPath)
            // если нужно делать ровно 8 сек, иначе полная длина
            .inputOption(
                settings.duration === 8
                    ? ['-loop 1', `-t ${settings.duration}`]
                    : ['-loop 1']
            )
            // и аудио
            .input(audioPath)
            // строим фильтр: showwaves + overlay
            .complexFilter([
                {
                    filter: 'showwaves',
                    options: {
                        s: '1080x400',
                        mode: 'cline',
                        colors: 'white'
                    },
                    inputs: '1:a',
                    outputs: 'wave'
                },
                {
                    filter: 'overlay',
                    options: { y: '1520', format: 'auto' },
                    inputs: ['0:v', 'wave']
                }
            ])
            .outputOptions([
                '-c:v libx264',
                '-preset fast',
                '-c:a aac',
                '-shortest'
            ])
            .output(outputPath)
            // логируем команду перед запуском
            .on('start', cmdLine => {
                console.log('FFmpeg command:', cmdLine);
            })
            // логируем каждую строку stderr
            .on('stderr', stderrLine => {
                console.log('FFmpeg stderr:', stderrLine);
            })
            .on('progress', p => {
                const percent = Math.min(100, Math.floor(p.percent || 0));
                console.log(`Rendering: ${percent}%`);
                updateJobProgress(jobId, percent).catch(console.error);
            })
            .on('error', (err, stdout, stderr) => {
                console.error('✖ FFmpeg failed:', err.message);
                console.error('ffmpeg stdout:', stdout);
                console.error('ffmpeg stderr:', stderr);
                reject(err);
            })
            .on('end', () => {
                console.log('✔ FFmpeg finished');
                resolve();
            });

        command.run();
    });
}
