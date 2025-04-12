# -*- mode: python ; coding: utf-8 -*-

block_cipher = None
project_dir = os.path.abspath('.')

from PyInstaller.utils.hooks import collect_dynamic_libs
binaries = collect_dynamic_libs('ctypes')

a = Analysis(
    ['main.py'],
    pathex=[project_dir],
    binaries=binaries,
    datas=[
        ('SFProDisplay-Bold.ttf', '.'),
        ('xploit_music_logo.png', '.'),
    ],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='MusicVisualizer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,       # консольное окно оставляем
    icon=None,
    onefile=True,       # 💥 ВАЖНО: Сборка в один .exe
    disable_windowed_traceback=False,
)
