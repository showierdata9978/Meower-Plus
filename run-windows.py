from warnings import catch_warnings


import os
try:
    import webbrowser
except:
    os.system("pip install webbrowser")
url= os.path.abspath(os.getcwd()) + '/index.html'
webbrowser.get('C:/Program Files/Google/Chrome/Application/chrome.exe %s').open(url)