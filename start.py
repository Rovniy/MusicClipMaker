import os
import numpy as np
from PIL import Image, ImageFilter
from moviepy import AudioFileClip, ImageClip, TextClip, ColorClip, CompositeVideoClip


def make_blurred_background(cover_clip: ImageClip,
                            final_w: int,
                            blur_radius: float = 20.0,
                            duration: float = 0) -> ImageClip:
    """
    Creates a blurred background clip by stretching the cover image to the final width
    and applying a Gaussian blur.
    """
    img_w, img_h = cover_clip.size
    scale_bg = final_w / img_w
    bg_w, bg_h = final_w, int(img_h * scale_bg)

    # Resize the cover temporarily
    cover_bg_tmp = cover_clip.resized((bg_w, bg_h))

    # Extract the frame as a numpy array
    bg_frame = cover_bg_tmp.get_frame(0)
    # Convert to PIL and blur
    bg_frame_pil = Image.fromarray(bg_frame).filter(ImageFilter.GaussianBlur(radius=blur_radius))

    # Create a new ImageClip from the blurred PIL image
    blurred_bg = ImageClip(np.array(bg_frame_pil))
    return (blurred_bg
            .with_position(("center", "center"))
            .with_duration(duration))


def make_foreground_cover(cover_clip: ImageClip,
                          final_h: int,
                          duration: float) -> ImageClip:
    """
    Creates the foreground cover by stretching it to fill the final height (1080p).
    """
    img_w, img_h = cover_clip.size
    scale_fg = final_h / img_h
    fg_w, fg_h = int(img_w * scale_fg), final_h

    return (cover_clip
            .resized((fg_w, fg_h))
            .with_position(("center", "center"))
            .with_duration(duration))


def make_text_with_bg(text: str,
                      x_center: str or float = 'center',
                      y_top: float = 50,
                      font_size: int = 70,
                      duration: float = 0,
                      padding: int = 20,
                      color=(0, 0, 0),
                      text_color='white') -> tuple:
    """
    Creates two clips:
      1) A black (or semi-transparent) background rectangle sized according to the text.
      2) The text itself.
    Returns (bg_clip, text_clip).
    """
    font_path = 'C:/Windows/Fonts/Impact.ttf'

    # Create the text clip
    text_clip = (TextClip(
        text=text,
        font=font_path,
        font_size=font_size,
        color=text_color,
        method='label',
        text_align='center'
    )
    .with_duration(duration)
    .with_position((x_center, y_top)))

    # Get the actual size of the text clip
    text_w, text_h = text_clip.size

    # Create the background rectangle
    bg_clip = (ColorClip((text_w + padding * 2, text_h + padding * 2), color=color)
               .with_duration(duration)
               .with_position((x_center, y_top - padding)))

    return bg_clip, text_clip


def create_video(audio_path, cover_path, output_path, artist='ZYNTHAR'):
    """
    Creates a music video:
    - Blurred background (width-stretched),
    - Foreground cover (height-stretched),
    - Two text blocks (artist on top, track name on bottom) each with a black background.
    - Resolution: 1920x1080, fps=1
    """

    # --- Load audio ---
    audio = AudioFileClip(audio_path)
    duration = audio.duration

    final_w, final_h = 1920, 1080
    text_padding = 20

    # --- Create a black fallback background (just in case) ---
    fallback_bg = ColorClip(size=(final_w, final_h), color=(0, 0, 0)).with_duration(duration)

    # --- Load cover as ImageClip ---
    original_cover = ImageClip(cover_path)

    # --- Create blurred background ---
    cover_bg = make_blurred_background(
        cover_clip=original_cover,
        final_w=final_w,
        duration=duration
    )

    # --- Create foreground cover (no blur) ---
    cover_fg = make_foreground_cover(
        cover_clip=original_cover,
        final_h=final_h,
        duration=duration
    )

    # --- Create top text (artist) with black background ---
    top_bg, top_txt = make_text_with_bg(
        text=artist,
        duration=duration,
        padding=text_padding
    )

    # --- Create bottom text (track name) with black background ---
    base_name = os.path.splitext(os.path.basename(audio_path))[0]
    bottom_text_str = base_name.upper()
    bottom_y = final_h - 130

    bot_bg, bot_txt = make_text_with_bg(
        text=bottom_text_str,
        y_top=bottom_y,
        duration=duration,
        padding=text_padding
    )

    # --- Composite final clip ---
    final_clip = CompositeVideoClip([
        fallback_bg,
        cover_bg,
        cover_fg,
        top_bg,  # black box behind top text
        top_txt,
        bot_bg,  # black box behind bottom text
        bot_txt
    ], size=(final_w, final_h)).with_audio(audio)

    # --- Export video ---
    final_clip.write_videofile(
        output_path,
        fps=1,
        codec='h264_nvenc',
        audio_codec='aac',
        audio_bitrate="320k",
    )


def main():
    artist_input = input("Enter artist name (default 'ZYNTHAR'): ").strip()
    artist_name = artist_input if artist_input else "ZYNTHAR"

    current_dir = os.path.dirname(os.path.abspath(__file__))
    mastered_dir = os.path.join(current_dir, "Mastered")
    covers_dir = os.path.join(current_dir, "Covers")
    videos_dir = os.path.join(current_dir, "Videos")

    if not os.path.exists(videos_dir):
        os.makedirs(videos_dir)

    processed_tracks = []
    error_tracks = []

    for filename in os.listdir(mastered_dir):
        audio_path = os.path.join(mastered_dir, filename)

        if not os.path.isfile(audio_path):
            continue

        ext = os.path.splitext(filename)[1].lower()
        if ext not in [".wav", ".mp3", ".flac", ".ogg"]:
            continue

        base_name = os.path.splitext(filename)[0]
        cover_name = f"{base_name}.jpeg"
        cover_path = os.path.join(covers_dir, cover_name)

        if not os.path.exists(cover_path):
            error_tracks.append((filename, f"Cover '{cover_name}' not found in 'Covers' folder."))
            continue

        output_name = f"{base_name}.mp4"
        output_path = os.path.join(videos_dir, output_name)

        if os.path.exists(output_path):
            print(f"[SKIP] Video already exists. Skipping: {output_name}")
            processed_tracks.append(filename)
            continue

        print(f"[INFO] Processing: {filename}")
        try:
            create_video(audio_path, cover_path, output_path, artist=artist_name)
            processed_tracks.append(filename)
            print(f"[OK] Video saved: {output_name}\n")
        except Exception as e:
            error_tracks.append((filename, str(e)))
            print(f"[ERROR] Failed to create video for '{filename}': {e}\n")

    print("\n===== PROCESSING RESULTS =====\n")
    if processed_tracks:
        print("Successfully created videos for:")
        for track in processed_tracks:
            print(f"  - {track}")
    else:
        print("No videos were created.")

    if error_tracks:
        print("\nSkipped/Errors:")
        for track, reason in error_tracks:
            print(f"  - {track}: {reason}")
    else:
        print("\nNo errors encountered!")


if __name__ == "__main__":
    main()
