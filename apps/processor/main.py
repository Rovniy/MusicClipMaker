#!/usr/bin/env python3
"""
PoC: аудио + обложка → вертикальный MP4 c динамической waveform-анимацией.

Запуск внутри контейнера:
    python main.py <audio_path> <cover_path> <output_path>

ENV:
    FORCE_8S — если установлена (любое значение), обрезает аудио до 8 секунд.
"""

import os
import sys
import numpy as np
from moviepy.editor import (
    AudioFileClip,
    ImageClip,
    ColorClip,
    CompositeVideoClip,
)
from moviepy.video.VideoClip import VideoClip  # <-- правильный импорт

# ─────────────────────── Настройки визуализации ─────────────────────── #
N_BARS      = 200     # число «палок» в waveform
BAR_AREA_H  = 400     # высота области waveform, px
BOTTOM_PAD  = 60      # отступ от низа, px
RAW_FPS     = 44100   # частота дискретизации для анализа аудио
FRAME_RATE  = 30      # fps результирующего видео
WINDOW_DUR  = 0.5     # сек (ширина «скользящего» окна для анализа)

# ──────────────────────── Помощник: амплитуды ──────────────────────── #
def bars_from_audio(clip: AudioFileClip, n_bars: int) -> np.ndarray:
    """
    Для каждого чанка (iter_chunks с фикс. chunksize) усредняем амплитуды
    в n_bars корзин и нормализуем (0…1).
    """
    CHUNK = 1024
    chunks = list(clip.iter_chunks(fps=RAW_FPS, chunksize=CHUNK, quantize=False))
    if not chunks:
        raise ValueError("Не удалось прочитать аудио (iter_chunks вернул пусто)")
    raw = np.concatenate(chunks, axis=0)          # (samples, channels)
    mono = np.abs(raw.mean(axis=1))               # моно + abs
    spb  = max(1, len(mono) // n_bars)            # samples per bar
    bars = mono[:spb*n_bars]                      \
           .reshape(n_bars, spb)                  \
           .mean(axis=1)
    return bars / (bars.max() + 1e-6)              # нормализация

# ─────────────────────── Помощник: рисуем бары ─────────────────────── #
def build_waveform(width: int, amps: np.ndarray, area_h: int) -> CompositeVideoClip:
    """
    Собирает CompositeVideoClip из белых ColorClip-«палок» по amplitudes.
    """
    bar_w = width / len(amps)
    clips = []
    for i, a in enumerate(amps):
        h = max(2, int(a * area_h))
        bar = ColorClip(size=(int(bar_w) + 2, h), color=(255, 255, 255))
        bar = bar.set_position((int(i * bar_w), int(area_h - h)))
        clips.append(bar)
    return CompositeVideoClip(clips).set_opacity(0.65)

# ─────────────────────────────── Рендер ─────────────────────────────── #
def render_video(audio_p: str, cover_p: str, out_p: str, force_8: bool = False):
    # 1) читаем аудио
    audio = AudioFileClip(audio_p)
    if force_8:
        audio = audio.subclip(0, min(8, audio.duration))

    # 2) фон: обложка в вертикальном формате 9:16
    bg = ImageClip(cover_p).resize(height=1920)

    # 3) динамическая waveform-анимация через VideoClip(make_frame)
    def make_frame(t):
        start = max(0, t - WINDOW_DUR/2)
        end   = min(audio.duration, start + WINDOW_DUR)
        sub   = audio.subclip(start, end)
        amps  = bars_from_audio(sub, N_BARS)
        wf    = build_waveform(bg.w, amps, BAR_AREA_H)
        return wf.get_frame(0)

    dyn_wave = VideoClip(make_frame, duration=audio.duration) \
        .set_fps(FRAME_RATE) \
        .set_position(("center", bg.h - BAR_AREA_H - BOTTOM_PAD))

    # 4) финальный монтаж
    final = CompositeVideoClip([bg, dyn_wave]) \
        .set_audio(audio) \
        .set_duration(audio.duration)

    # 5) экспорт
    final.write_videofile(
        out_p,
        fps=FRAME_RATE,
        codec="libx264",
        preset="fast",
        audio_codec="aac"
    )

# ───────────────────────────────── CLI ───────────────────────────────── #
if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python main.py <audio> <cover> <output>", file=sys.stderr)
        sys.exit(1)
    render_video(
        audio_p=sys.argv[1],
        cover_p=sys.argv[2],
        out_p=sys.argv[3],
        force_8=bool(os.getenv("FORCE_8S")),
    )
