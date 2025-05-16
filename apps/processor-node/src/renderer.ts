// apps/processor-node/src/renderer.ts
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

export interface RenderSettings {
    duration: number | 'full';
    format: '9:16' | '1:1' | '16:9';
    theme: string;
    mute: boolean;
    title?: string;
    artist?: string;
}

export async function render(
    audioPath: string,
    coverPath: string,
    outputPath: string,
    settings: RenderSettings
): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .setFfmpegPath(ffmpegPath!)
            .input(coverPath).loop()
            .input(audioPath)
            .complexFilter([
                {
                    filter: 'showwaves',
                    options: { s: '1080x400', mode: 'cline', colors: 'white' },
                    inputs: '1:a', outputs: 'wave'
                },
                {
                    filter: 'scale',
                    options: getScale(settings.format),
                    inputs: '0:v', outputs: 'bg'
                },
                {
                    filter: 'overlay',
                    options: { x: 0, y: 'main_h-400' },
                    inputs: ['bg', 'wave'], outputs: 'vout'
                }
            ], 'vout')
            .outputOptions(['-map [vout]', '-map 1:a', '-c:v libx264', '-preset fast', '-c:a aac', '-shortest'])
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}

function getScale(format: RenderSettings['format']): string {
    switch (format) {
        case '9:16': return '1080:1920';
        case '1:1': return '1080:1080';
        case '16:9': return '1920:1080';
    }
}