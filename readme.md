# Music Video Generator

This repository provides a **Python script** that generates simple music videos from audio files and cover images.  
It automatically creates an HD video (1920×1080) with:
- A **blurred background** version of the cover image.  
- A **foreground** cover image stretched to full height.  
- **Two text blocks** (artist name on top, track name at the bottom) with semi-transparent black backgrounds.  
- **Audio** from your `.wav`, `.mp3`, `.flac`, or `.ogg` files.  

## How It Works

1. The script reads **audio files** from the `Mastered` folder.  
2. For each audio file, it looks for a **cover image** with the same name (but with a `.jpeg` extension) in the `Covers` folder.  
3. It **creates a video** for each matching pair, placing the output in the `Videos` folder.  
4. By default, it uses `ZYNTHAR` (all caps) as the artist name. You can **input** a custom artist name at runtime.

The final video will have:
- **Blurred background** (cover image stretched to width, blurred with a Gaussian filter).  
- **Foreground cover** (cover image stretched to height).  
- **Artist name** on top with a black (semi-transparent) box behind it.  
- **Track name** (uppercase) on bottom with a black (semi-transparent) box.  
- **Audio** embedded in the `.mp4` file, encoded in AAC.  

## Dependencies

- **Python 3.7+** (recommended)  
- [**MoviePy**](https://github.com/Zulko/moviepy)  
- **FFmpeg** installed and accessible via command line  
- [**Pillow** (PIL)](https://pypi.org/project/Pillow/)  

### Installing the Dependencies

```bash
pip install moviepy pillow
```

You also need a working **FFmpeg** installation. Download it from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html) or install via your package manager. Make sure `ffmpeg` is in your PATH.

## Technology Stack

- **MoviePy**: Used for creating video clips, compositing layers, adding audio, and final export to `.mp4`.  
- **FFmpeg**: Handles the underlying audio/video encoding (e.g., `h264_nvenc`, `aac`).  
- **Pillow**: Applies image transformations (especially Gaussian blur) and text rendering for the script.  
- **Python**: The script orchestrates all operations, from file I/O to final rendering commands.

## Usage

1. **Place your audio files** (`.wav`, `.mp3`, `.flac`, `.ogg`) in the `Mastered` folder.  
2. **Place your cover images** in the `Covers` folder. Each image must match the audio file’s name but have the `.jpeg` extension.  
3. (Optional) **Modify** the script if you want to change the default fonts, text positions, or effects.  
4. **Run the script** from the repository’s root directory:

   ```bash
   python start.py
   ```

5. **Enter the artist name** when prompted or press Enter to default to `ZYNTHAR`.  
6. Videos will be generated in the `Videos` folder with the same base name as the audio files.

### Example

If you have the following structure:

```
MyAlbum/
├── Covers/
│   ├── Song1.jpeg
│   └── Song2.jpeg
├── Mastered/
│   ├── Song1.wav
│   └── Song2.wav
├── Videos/       <-- will be filled with .mp4 files
└── start.py      <-- the script
```

When you run:

```bash
python start.py
```

It will create:
- `Song1.mp4` and `Song2.mp4` inside `Videos/`,  
- Each video will have audio from `Song1.wav`, `Song2.wav` respectively,  
- And each will use the matching `.jpeg` as the background/foreground cover.

## Contributing

Feel free to open issues or submit pull requests to improve the script or add new features:
- Different transitions  
- Additional text overlays  
- Alternative audio encoders and presets, etc.

## License

This project is released under the **MIT License**.

## Build

```bash
pyinstaller MusicVisualizer.spec
```