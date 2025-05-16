# apps/processor/src/renderer.py
"""
Визуализатор: читает аудио и обложку, генерирует waveform-анимацию и выводит видео.
"""
import os
import numpy as np
from moviepy.editor import (
    AudioFileClip,
    ImageClip,
    ColorClip,
    CompositeVideoClip
)

# Параметры визуализации
N_BARS = 200
BAR_AREA_H = 400
BOTTOM_PAD = 60
FRAME_RATE = 30
RAW_FPS = 44100
WINDOW_DUR = 0.5  # сек


def bars_from_audio(clip, n_bars=N_BARS):
    """
    Считывает аудио-клип, разбивает на n_bars корзин и возвращает массив амплитуд [0..1].
    """
    chunk_size = 1024
    chunks = list(clip.iter_chunks(fps=RAW_FPS, chunksize=chunk_size, quantize=False))
    raw = np.concatenate(chunks, axis=0)
    mono = np.abs(raw.mean(axis=1))
    spb = max(1, len(mono) // n_bars)
    bars = mono[:spb * n_bars].reshape(n_bars, spb).mean(axis=1)
    return bars / (bars.max() + 1e-6)


def build_waveform(width, amps, height=BAR_AREA_H):
    """
    Строит CompositeVideoClip из белых столбиков по массиву amps.
    """
    bar_w = width / len(amps)
    clips = []
    for i, a in enumerate(amps):
        h = max(2, int(a * height))
        bar = (
            ColorClip(size=(int(bar_w) + 2, h), color=(255, 255, 255))
            .set_position((int(i * bar_w), height - h))
        )
        clips.append(bar)
    return CompositeVideoClip(clips).set_opacity(0.65)


def render_video(audio_path: str, cover_path: str, output_path: str, force_8: bool = False):
    """
    Основная функция: читает файлы, создаёт динамический waveform и сохраняет MP4.
    """
    audio = AudioFileClip(audio_path)
    if force_8:
        audio = audio.subclip(0, min(8, audio.duration))

    # фон обложка → вертикальный формат
    bg = ImageClip(cover_path).resize(height=1920)

    # создаём динамическую анимацию
    def make_frame(t):
        start = max(0, t - WINDOW_DUR / 2)
        end = min(audio.duration, start + WINDOW_DUR)
        sub = audio.subclip(start, end)
        amps = bars_from_audio(sub)
        wf = build_waveform(bg.w, amps)
        return wf.get_frame(0)

    wave_clip = (
        CompositeVideoClip([])  # placeholder, заменён на VideoClip ниже
    )
    from moviepy.video.VideoClip import VideoClip
    wave_clip = (
        VideoClip(make_frame, duration=audio.duration)
        .set_fps(FRAME_RATE)
        .set_position(("center", bg.h - BAR_AREA_H - BOTTOM_PAD))
    )

    final = CompositeVideoClip([bg, wave_clip]).set_audio(audio).set_duration(audio.duration)
    final.write_videofile(output_path, fps=FRAME_RATE, codec="libx264", preset="fast", audio_codec="aac")