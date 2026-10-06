import os

OUT = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(OUT, exist_ok=True)

def tile(name, w, h, c1, c2, label, emoji, dark_text=False, pattern="circles"):
    text_color = "#14161a" if dark_text else "#ffffff"
    sub_color = "rgba(20,22,26,.55)" if dark_text else "rgba(255,255,255,.75)"
    ideal = w * 0.075
    fit = (w * 0.84) / max(len(label), 1) / 0.58
    label_font_size = int(max(14, min(ideal, fit)))
    deco = ""
    if pattern == "circles":
        deco = f'''
        <circle cx="{w*0.85}" cy="{h*0.15}" r="{min(w,h)*0.22}" fill="rgba(255,255,255,.10)"/>
        <circle cx="{w*0.08}" cy="{h*0.92}" r="{min(w,h)*0.28}" fill="rgba(255,255,255,.08)"/>
        <circle cx="{w*0.5}" cy="{h*0.5}" r="{min(w,h)*0.55}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
        '''
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{c1}"/>
      <stop offset="100%" stop-color="{c2}"/>
    </linearGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#g)"/>
  {deco}
  <text x="50%" y="{h*0.55}" text-anchor="middle" font-family="Arial, sans-serif" font-size="{int(min(w,h)*0.22)}">{emoji}</text>
  <text x="50%" y="{h*0.80}" text-anchor="middle" font-family="Arial, sans-serif" font-size="{label_font_size}" font-weight="700" fill="{text_color}" letter-spacing="1">{label.upper()}</text>
</svg>'''
    with open(os.path.join(OUT, f"{name}.svg"), "w") as f:
        f.write(svg)

# Destinations (square-ish, used in circular crops)
tile("dest-ibiza", 400, 400, "#ff6a66", "#ffb199", "Ibiza", "\U0001F942")
tile("dest-iceland", 400, 400, "#134e5e", "#4ca1af", "Iceland", "\U0001F9CA")
tile("dest-zurich", 400, 400, "#232a5c", "#6f7bf7", "Zurich", "\U0001F3D4")
tile("dest-paris", 400, 400, "#5b2c82", "#f6a5c0", "Paris", "\U0001F5FC")
tile("dest-bali", 400, 400, "#0f4c3a", "#7fd8a4", "Bali", "\U0001F334")
tile("dest-thailand", 400, 400, "#f12711", "#f5af19", "Thailand", "\U0001F6D5")
tile("dest-mexico", 400, 400, "#cb2d3e", "#ef473a", "Mexico", "\U0001F335")
tile("dest-tomorrowland", 400, 400, "#8e2de2", "#4a00e0", "Belgium", "\U0001F3AA")
tile("dest-dubai", 400, 400, "#3c1053", "#bf953f", "Dubai", "\U0001F3D9")
tile("dest-vietnam", 400, 400, "#0b486b", "#f56217", "Vietnam", "⛵")

# Package / special cards (landscape)
tile("pkg-ibiza-closing", 800, 500, "#ff6a66", "#c22b6b", "Ibiza Closing Fiesta", "\U0001F389")
tile("pkg-tomorrowland", 800, 500, "#8e2de2", "#4a00e0", "Tomorrowland Belgium", "\U0001F3AA")
tile("pkg-zurich-nye", 800, 500, "#141e30", "#243b55", "Zurich New Year", "✨")
tile("pkg-paris-lights", 800, 500, "#5b2c82", "#e05ca4", "Paris City Lights", "\U0001F5FC")
tile("pkg-iceland-lights", 800, 500, "#0f2027", "#2c5364", "Iceland Northern Lights", "\U0001F30C")
tile("pkg-fullmoon", 800, 500, "#134e5e", "#71b280", "Koh Phangan Full Moon", "\U0001F319")
tile("pkg-oktoberfest", 800, 500, "#ee9ca7", "#ffdde1", "Oktoberfest Munich", "\U0001F37B", dark_text=True)
tile("pkg-bali-escape", 800, 500, "#0f4c3a", "#7fd8a4", "Bali Island Escape", "\U0001F3DD")

# Blog covers
tile("blog-island-life", 800, 500, "#134e5e", "#71b280", "Island Life", "\U0001F3DD")
tile("blog-europe-routes", 800, 500, "#5b2c82", "#f6a5c0", "Europe Routes", "\U0001F30D")
tile("blog-packing-guide", 800, 500, "#ff6a66", "#ffb199", "Packing Guide", "\U0001F9F3")

# Category icons (small squares, used as flat icon tiles)
tile("cat-festival", 200, 200, "#8e2de2", "#4a00e0", "", "\U0001F3AA")
tile("cat-group", 200, 200, "#ff6a66", "#ffb199", "", "\U0001F46F")
tile("cat-custom", 200, 200, "#0f4c3a", "#7fd8a4", "", "\U0001F9ED")
tile("cat-domestic", 200, 200, "#f12711", "#f5af19", "", "\U0001F1EE\U0001F1F3")
tile("cat-international", 200, 200, "#134e5e", "#4ca1af", "", "\U0001F30F")

# About page image
tile("about-hero", 900, 700, "#14161a", "#3c1053", "Core Memories Club", "\U0001F30D")

print("done, files:", len(os.listdir(OUT)))
