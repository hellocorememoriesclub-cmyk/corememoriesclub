import urllib.request, os

OUT = os.path.join(os.path.dirname(__file__), "images", "real")
os.makedirs(OUT, exist_ok=True)

files = {
    "logo": "https://framerusercontent.com/images/kxKi8CS64bbzgcM4gsx9cPSzLY.png",
    "ibiza-party": "https://framerusercontent.com/images/cnONzk7xRdcAxsKfqxUyZLLNDs.jpg?width=1200",
    "paris-louvre": "https://framerusercontent.com/images/P7qHwpj4YqIYga0mQIVYI9W98J8.jpeg?width=1200",
    "zurich-boat": "https://framerusercontent.com/images/di4LZ3IhpO6SsPa1eeYTI333E.jpeg?width=1200",
    "paris-eiffel-day": "https://framerusercontent.com/images/pCpG4OVGABMojBODH85Ob7RsY.jpg?width=1200",
    "zurich-buildings": "https://framerusercontent.com/images/fwhqG03zmpiJ9yMcAtxyEH17kA.jpg?width=1200",
    "paris-eiffel-night": "https://framerusercontent.com/images/CiYRySldLnaXeIK0Bnf1DQKEsOw.jpg?width=1200",
    "zurich-lake-mountains": "https://framerusercontent.com/images/XCjJsm9SKOekBAOycjFPNqvyFFU.jpg?width=1200",
    "cherry-blossom-canal": "https://framerusercontent.com/images/QnUBDM68vvHz0UsQJyBafmO28.jpg?width=1200",
    "boat-aerial": "https://framerusercontent.com/images/oBWWR2VBdge6DncI7CvQGE4cw.jpg?width=1200",
    "palm-mountain-valley": "https://framerusercontent.com/images/GVzFj0FRkt6dKJeQ35PnePxhlq4.jpg?width=1200",
    "granite-cliffs-hiker": "https://framerusercontent.com/images/ZGryEihiXq7PlsyFwHKqcPnN0.jpg?width=1200",
    "girl-backpack-path": "https://framerusercontent.com/images/AdJfrnZRgFA6p5tZ7l7Xq8JMe8.jpg?width=1200",
    "cherry-blossom-canal-2": "https://framerusercontent.com/images/AQCHryM3eMTkER4JdKga7nPw3E4.png?width=1200",
    "iceland-aurora": "https://framerusercontent.com/images/Wf2MNykv3Zg5ogSRxiaSZFyJGdI.jpg?width=1200",
    "festival-tent-night": "https://framerusercontent.com/images/SV1MiT2BJSPLRUGiJqhm8CRVHkg.jpg?width=1200",
    "blog-island-life": "https://framerusercontent.com/images/fnpLE5hmx0TEyoOQTqDrMgpFeKM.jpg?width=1200",
    "blog-europe-routes": "https://framerusercontent.com/images/11XPhKRlhd7wncA5TpSiMzVW28.jpg?width=1200",
    "faq-decor": "https://framerusercontent.com/images/PkuwSPKtfeCh4tMbcyxtZBYvd2k.png",
    "pool-bench": "https://framerusercontent.com/images/Z0gjroJzfJ4MBmkL0KJkBIOI2jA.jpg?width=1200",
}

headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

for name, url in files.items():
    ext = url.split("?")[0].rsplit(".", 1)[-1]
    path = os.path.join(OUT, f"{name}.{ext}")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp, open(path, "wb") as f:
            data = resp.read()
            f.write(data)
        print(f"{name}.{ext} -> {len(data)} bytes")
    except Exception as e:
        print(f"{name}.{ext} -> FAILED: {e}")
