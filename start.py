import os
import numpy as np
from PIL import Image, ImageFilter

# MoviePy
from moviepy import (
    AudioFileClip,
    ImageClip,
    TextClip,
    ColorClip,
    CompositeVideoClip
)

def create_video(audio_path, cover_path, output_path, artist = 'ZYNTHAR'):
    """
    Создаёт видео из одного аудиофайла и картинки (обложки).
    На заднем плане (фон) - обложка, растянута по ширине (1920), размыта.
    На переднем плане - обложка, растянута по высоте (1080), без размытия.
    Вверху текст "ZYNTHAR", внизу - название трека (большие буквы).
    Разрешение 1920x1080, fps=1.
    """
    # -------------------------------------------------------------------------
    # 1. ЗАГРУЗКА АУДИО
    audio = AudioFileClip(audio_path)
    duration = audio.duration

    final_w = 1920
    final_h = 1080
    text_padding = 20

    local_font = 'C:/Windows/Fonts/Impact.ttf'

    # -------------------------------------------------------------------------
    # 2. ФОН (однотонный чёрный, на всякий случай)
    background_clip = ColorClip(size=(final_w, final_h), color=(0, 0, 0))
    background_clip = background_clip.with_duration(duration)

    # -------------------------------------------------------------------------
    # 3. ЗАГРУЗКА ОБЛОЖКИ (ImageClip)
    original_cover = ImageClip(cover_path)

    # Исходные размеры картинки
    img_w, img_h = original_cover.size

    # -------------------------------------------------------------------------
    # 4. ЗАДНИЙ ПЛАН (РАЗМЫТЫЙ)
    #    4.1. Определяем масштаб, чтобы растянуть по ширине (1920)
    scale_bg = final_w / img_w
    bg_w = final_w
    bg_h = int(img_h * scale_bg)

    #    4.2. Создаём временный клип для изменения размера
    cover_bg_tmp = original_cover.resized((bg_w, bg_h))

    #    4.3. Извлекаем кадр (так как обложка статична, это будет один и тот же кадр)
    bg_frame = cover_bg_tmp.get_frame(0)  # numpy-array [h, w, 3]
    #    4.4. Превращаем в PIL-изображение, размываем
    bg_frame_pil = Image.fromarray(bg_frame)
    bg_frame_pil = bg_frame_pil.filter(ImageFilter.GaussianBlur(radius=20))

    #    4.5. Создаём из размытой PIL-картинки новый ImageClip
    cover_bg = ImageClip(np.array(bg_frame_pil))
    cover_bg = (cover_bg
                .with_position(("center", "center"))
                .with_duration(duration))

    # -------------------------------------------------------------------------
    # 5. ПЕРЕДНИЙ ПЛАН (БЕЗ РАЗМЫТИЯ)
    #    Растягиваем по высоте (1080)
    scale_fg = final_h / img_h
    fg_w = int(img_w * scale_fg)
    fg_h = final_h

    cover_fg = (original_cover
                .resized((fg_w, fg_h))
                .with_position(("center", "center"))
                .with_duration(duration))

    # -------------------------------------------------------------------------
    # 6. ТЕКСТОВЫЕ КЛИПЫ

    # Вверху - "ZYNTHAR"
    top_text_clip = (TextClip(
        text=artist,
        font=local_font,  # путь к реальному TTF
        font_size=70,
        color='white',
        method='label',
        text_align='center'
    )
        .with_duration(duration)
        .with_position(('center', 50)))


    text_w, text_h = top_text_clip.size

    # Создаём чёрный прямоугольник чуть больше текста (добавим отступы)
    bg_clip_top = (
        ColorClip((text_w + text_padding * 2, text_h + text_padding * 2), color=(0, 0, 0, 0.8))
               .with_position(('center', 50 - text_padding))
               .with_duration(duration)
    )


    # Внизу - название трека (большие буквы)
    base_name = os.path.splitext(os.path.basename(audio_path))[0]
    bottom_text_str = base_name.upper()

    bottom_text_y = final_h - 130
    bottom_text_clip = (TextClip(
        text=bottom_text_str,
        font=local_font,
        font_size=70,
        color='white',
        method='label',
        text_align='center'
    )
        .with_duration(duration)
        .with_position(('center', bottom_text_y)))

    text_w, text_h = bottom_text_clip.size

    # Создаём чёрный прямоугольник чуть больше текста (добавим отступы)
    bg_clip_bottom = (
        ColorClip((text_w + text_padding * 2, text_h + text_padding * 2), color=(0, 0, 0, 0.8))
        .with_position(('center', bottom_text_y - text_padding))
        .with_duration(duration)
    )

    # -------------------------------------------------------------------------
    # 7. Объединяем клипы (порядок наложения важен)
    final_clip = CompositeVideoClip([
        background_clip,  # чёрный фон
        cover_bg,         # размытая обложка
        cover_fg,         # обложка поверх
        bg_clip_top,
        top_text_clip,
        bg_clip_bottom,
        bottom_text_clip
    ], size=(final_w, final_h))

    final_clip = final_clip.with_audio(audio)

    # -------------------------------------------------------------------------
    # 8. Сохраняем финальное видео
    final_clip.write_videofile(
        output_path,
        fps=1,
        codec='h264_nvenc',  # при наличии GPU и ffmpeg с nvenc
        audio_codec='aac',
        audio_bitrate="320k",
    )


def main():
    artist = input("Введите имя исполнителя (по умолчанию ZYNTHAR): ").strip()
    if not artist:
        artist = "ZYNTHAR"

    """
    1. Проходим по папке Mastered (WAV / MP3 / и т.д.).
    2. Для каждого файла ищем обложку .jpeg в Covers с тем же именем.
    3. Создаём видео в Videos с тем же названием ( .mp4 ).
    4. В конце печатаем два списка: успешно обработанные и пропущенные (с ошибками).
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))

    mastered_dir = os.path.join(current_dir, "Mastered")
    covers_dir   = os.path.join(current_dir, "Covers")
    videos_dir   = os.path.join(current_dir, "Videos")

    if not os.path.exists(videos_dir):
        os.makedirs(videos_dir)

    success_list = []
    fail_list = []

    # Перебираем файлы в Mastered
    for filename in os.listdir(mastered_dir):
        audio_path = os.path.join(mastered_dir, filename)

        if not os.path.isfile(audio_path):
            continue

        ext = os.path.splitext(filename)[1].lower()
        if ext not in [".wav", ".mp3", ".flac", ".ogg"]:
            continue

        base_name = os.path.splitext(filename)[0]
        cover_name = base_name + ".jpeg"
        cover_path = os.path.join(covers_dir, cover_name)

        if not os.path.exists(cover_path):
            reason = f"Обложка '{cover_name}' не найдена в папке Covers."
            fail_list.append((filename, reason))
            continue

        output_name = base_name + ".mp4"
        output_path = os.path.join(videos_dir, output_name)

        # Проверяем, не существует ли уже файл
        if os.path.exists(output_path):
            print(f"[SKIP] Видео уже существует и будет пропущено: {output_name}")
            success_list.append(filename)  # или можно написать "skip_list"
            continue

        print(f"[INFO] Начинаем обработку: {filename}")

        try:
            create_video(audio_path, cover_path, output_path, artist)
            success_list.append(filename)
            print(f"[OK] Успешно сохранено видео: {output_name}\n")
        except Exception as e:
            fail_list.append((filename, str(e)))
            print(f"[ERROR] Не удалось создать видео для '{filename}': {e}\n")

    print("\n===== РЕЗУЛЬТАТ ОБРАБОТКИ =====\n")
    if success_list:
        print("Успешно созданы видео для:")
        for s in success_list:
            print("  -", s)
    else:
        print("Нет успешно обработанных файлов.")

    if fail_list:
        print("\nПропущенные/ошибки:")
        for f, reason in fail_list:
            print(f"  - {f}: {reason}")
    else:
        print("\nОшибок не обнаружено!")


if __name__ == "__main__":
    main()
