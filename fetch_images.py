import urllib.request
import re

url = "https://www.zoetze.be/themataarten"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        # find all image urls. Wix usually uses static.wixstatic.com
        img_urls = re.findall(r'https://static\.wixstatic\.com/media/[a-zA-Z0-9_\~]+\.(?:jpg|png|webp|jpeg)', html)
        img_urls = list(set(img_urls))
        print("Found images:", len(img_urls))
        for i, u in enumerate(img_urls[:10]):
            print(f"Image {i+1}: {u}")
except Exception as e:
    print("Error:", e)
