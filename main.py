import sys
import os
import traceback
import random
import numpy as np
from collections import Counter
from PIL import Image, ImageFont, ImageDraw, ImageFilter
from moviepy.audio.io.AudioFileClip import AudioFileClip
from moviepy.video.VideoClip import VideoClip

if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.abspath(".")

font_path = os.path.join(base_path, "SFProDisplay-Bold.ttf")
logo_path = os.path.join(base_path, "xploit_music_logo.png")

fps = 30
width, height = 1080, 1920
all_duration = 7
loop_duration = all_duration + 1 / fps

particle_count = 120
sparkle_count = 80
vivid_colors = [
    (255, 102, 102), (102, 255, 204), (102, 178, 255),
    (255, 255, 102), (255, 153, 255)
]

particles = [{
    "x": random.uniform(0, width),
    "y": random.uniform(0, height),
    "vx": random.uniform(-0.5, 0.5),
    "vy": random.uniform(-0.5, 0.5),
    "size": random.uniform(1, 4),
    "alpha": random.uniform(0.05, 0.2),
    "depth": random.uniform(0.3, 1.0)
} for _ in range(particle_count)]

sparkles = [{
    "angle": random.uniform(0, 2 * np.pi),
    "speed": random.uniform(10, 40),
    "size": random.uniform(1, 6),
    "alpha": random.uniform(0.05, 0.1),
} for _ in range(sparkle_count)]


def extract_palette(image_path, num_colors=5):
    image = Image.open(image_path).convert('RGB').resize((100, 100))
    pixels = list(image.getdata())
    most_common = Counter(pixels).most_common(num_colors)
    return [tuple(int(v) for v in color) for color, _ in most_common]


def average_color(image_path):
    image = Image.open(image_path).convert('RGB').resize((50, 50))
    pixels = np.array(image).reshape(-1, 3)
    return tuple(min(255, int(c * 1.15)) for c in np.mean(pixels, axis=0))


def add_noise_layer(image, alpha=20):
    noise = np.random.randint(0, 256, (height, width), dtype=np.uint8)
    noise_img = Image.fromarray(noise, mode='L').convert('RGBA')
    noise_img.putalpha(alpha)
    return Image.alpha_composite(image, noise_img)


def create_visual_frame(t, cover_img, palette, track_title, bg_color, logo_img):
    period = loop_duration
    t = t % period
    base = Image.new('RGBA', (width, height), bg_color + (255,))
    draw = ImageDraw.Draw(base, 'RGBA')

    bg = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg, 'RGBA')
    for i in range(6):
        phase_shift = np.sin(2 * np.pi * (t / period) + i)
        radius = 600 + 200 * phase_shift
        color_rgb = tuple(
            int(palette[i % len(palette)][j] * 0.6 + vivid_colors[i % len(vivid_colors)][j] * 0.4)
            for j in range(3)) + (60,)
        x = int(width // 2 + 300 * np.sin(t + i))
        y = int(height // 2 + 300 * np.cos(t * 0.8 + i))
        bg_draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color_rgb)
    bg = bg.filter(ImageFilter.GaussianBlur(radius=40))
    base.alpha_composite(bg)

    for p in particles:
        px = p["x"] + p["vx"] * t * 60
        py = p["y"] + p["vy"] * t * 60
        if 0 <= px < width and 0 <= py < height:
            alpha = int(255 * p["alpha"] * p["depth"])
            size = p["size"]
            draw.ellipse((px - size, py - size, px + size, py + size), fill=(255, 255, 255, alpha))

    for i in range(sparkle_count):
        s = sparkles[i]
        angle = s["angle"] + t * s["speed"] * 0.01
        dist = 200 + 300 * np.sin(t + i)
        x = int(width // 2 + dist * np.cos(angle))
        y = int(height // 2 + dist * np.sin(angle))
        if 0 <= x < width and 0 <= y < height:
            draw.ellipse((x - 1, y - 1, x + 1, y + 1), fill=(255, 255, 255, int(255 * s["alpha"])))

    ring_lifetime = 2.0
    ring_interval = period / 3
    ring_colors = [(173, 255, 240), (64, 224, 208), (0, 255, 204)]
    for impulse_index in range(3):
        base_birth_time = impulse_index * ring_interval
        for j in range(3):
            delay = j * 0.10
            birth_time = base_birth_time + delay
            age = t - birth_time
            if 0 <= age <= ring_lifetime:
                progress = age / ring_lifetime
                r = 300 + progress * 600
                alpha = int(255 * (1 - progress))
                lw = int(8 * (1 - progress) + 1)
                color = ring_colors[j] + (alpha,)
                draw.ellipse(
                    (width // 2 - r, height // 2 - r, width // 2 + r, height // 2 + r),
                    outline=color, width=lw)
    font_large = ImageFont.truetype(font_path, 80)
    draw.text(((width - font_large.getlength(track_title)) // 2, int(height * 0.1) + 90), track_title,
              font=font_large, fill=(255, 255, 255, 255))

    angle = np.sin(2 * np.pi * (t / period) * 0.5) * 10
    rotated = cover_img.rotate(angle, resample=Image.BICUBIC, expand=True).convert('RGBA')
    cover_w = int(width * 0.6)
    cover_h = int(cover_w * rotated.height / rotated.width)
    resized = rotated.resize((cover_w, cover_h), Image.LANCZOS)
    base.alpha_composite(resized, (width // 2 - cover_w // 2, height // 2 - cover_h // 2))

    logo_width = int(300 * 1.5)
    logo_height = int(logo_width * logo_img.height / logo_img.width)
    resized_logo = logo_img.resize((logo_width, logo_height), Image.LANCZOS)
    logo_x = (width - logo_width) // 2
    logo_y = int((height + 1800) / 2 - logo_height // 2)
    base.alpha_composite(resized_logo, (logo_x, logo_y))

    # Хаотичная псевдо-полоска (внизу экрана)
    segment_len = 60
    step = width / segment_len
    for i in range(segment_len):
        x = int(i * step)
        phase = 2 * np.pi * ((t / period + i * 0.03) % 1)
        h = int(60 + 40 * np.sin(phase + np.sin(phase * 3 + i)))
        draw.line((x, 1800, x, 1800 - h), fill=(255, 255, 255, 90), width=2)

    # Хаотичная, но зацикленная волна
    def pseudo_random_wave(index):
        # Псевдослучайное значение на основе индекса и t
        seed = int((t + index) * 123.456) % 1000
        return (np.sin(seed * 0.1) + np.cos(seed * 0.05)) * 0.5 + 0.5

    wave_count = 100
    wave_step = (width + 200) // wave_count
    for i in range(wave_count):
        x = i * wave_step
        height_mod = pseudo_random_wave(i) * 80
        draw.line((x, 1800, x, 1800 - height_mod), fill=(255, 255, 255, 90), width=2)

    return np.array(add_noise_layer(base, alpha=15).convert('RGB'))

def main():
    artists = [d for d in os.listdir(".") if os.path.isdir(d) and not d.startswith('.') and d not in ['__pycache__']]
    for artist in artists:
        albums_root = os.path.join(artist, "Albums")
        if not os.path.exists(albums_root):
            continue

        albums = [a for a in os.listdir(albums_root) if os.path.isdir(os.path.join(albums_root, a))]

        for album in albums:
            album_path = os.path.join(albums_root, album)
            input_folder = os.path.join(album_path, "Mastered")
            cover_folder = os.path.join(album_path, "Covers")
            output_folder = os.path.join(album_path, "Visualization")
            os.makedirs(output_folder, exist_ok=True)

            if not os.path.exists(input_folder) or not os.path.exists(cover_folder):
                continue

            for filename in os.listdir(input_folder):
                if not filename.endswith(('.mp3', '.wav', '.ogg')):
                    continue

                base = os.path.splitext(filename)[0]
                audio_path = os.path.join(input_folder, filename)
                cover_path = next((os.path.join(cover_folder, base + ext)
                                   for ext in ['.jpg', '.jpeg', '.png']
                                   if os.path.exists(os.path.join(cover_folder, base + ext))), None)
                if not cover_path:
                    print(f"❌ Обложка не найдена: {artist}/{album}/{filename}")
                    continue

                output_path = os.path.join(output_folder, base + '.mp4')
                if os.path.exists(output_path):
                    print(f"⏭ Пропущено (уже есть): {artist}/{album}/{filename}")
                    continue

                try:
                    print(f"🎵 Визуализация: {artist}/{album}/{filename}")

                    cover_img = Image.open(cover_path).convert('RGBA')
                    palette = extract_palette(cover_path)
                    bg_color = average_color(cover_path)
                    logo_img = Image.open(logo_path).convert('RGBA')
                    clip = VideoClip(
                        lambda t: create_visual_frame(t, cover_img, palette, base, bg_color, logo_img),
                        duration=loop_duration
                    )

                    audioclip = AudioFileClip(audio_path).with_duration(all_duration)
                    clip = clip.with_audio(audioclip)
                    clip.write_videofile(
                        output_path,
                        fps=fps,
                        codec='libx264',
                        audio_codec='aac',
                        preset='medium',
                        ffmpeg_params=['-pix_fmt', 'yuv420p'],
                        threads=16
                    )
                except Exception as e:
                    print(f"❌ Ошибка при обработке {filename}: {e}")
                    traceback.print_exc()


if __name__ == "__main__":
    main()
