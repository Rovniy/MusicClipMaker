import os
import sys
import subprocess
import traceback

def resource_path(filename):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, filename)
    return filename

def run_main():
    print("🎬 Music Visualizer")
    print("📂 Текущая рабочая папка:", os.getcwd())

    for required in ['Mastered', 'Covers']:
        if not os.path.isdir(required):
            print(f"❌ Папка '{required}' не найдена рядом с .exe")
            input("\n⏳ Нажмите Enter для выхода...")
            return

    main_py = resource_path("main.py")
    try:
        subprocess.run([sys.executable, main_py], check=True)
    except Exception as e:
        print(f"❌ Ошибка запуска main.py: {e}")

    input("\n✅ Готово! Нажмите Enter, чтобы закрыть окно...")

if __name__ == '__main__':
    try:
        run_main()
    except Exception as e:
        print("❌ Ошибка при запуске main:")
        traceback.print_exc()

    input("\n⏳ Нажмите Enter, чтобы закрыть...")
