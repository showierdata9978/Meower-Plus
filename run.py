import os, platform

url = os.path.abspath(os.getcwd()) + '/index.html'
sys = platform.system()

if sys == "Linux":
    os.system(f"xdg-open {url}")
elif sys == "Darwin":
    os.system(f"open {url}")
elif sys == "Win32":
    os.system(f"start {url}")
