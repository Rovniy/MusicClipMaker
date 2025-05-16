# Music Video Generator

### Для билда

```bash
rm -rf .venv
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
pyinstaller MusicVisualizer.spec
```


```
docker run --rm -v $PWD/test:/data \
  musicvis-processor ./data/audio.wav ./data/cover.jpg ./data/out.mp4
  ```