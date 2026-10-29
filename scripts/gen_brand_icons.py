#!/usr/bin/env python3
"""Genera el favicon (casa sobre terracota, como el icono del footer) y la imagen OG de la home.

Uso: python3 scripts/gen_brand_icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import io
import struct

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
TERRACOTA = (196, 92, 62)
TERRACOTA_DARK = (168, 74, 50)
CREMA = (250, 247, 242)
GRAFITO = (45, 45, 45)
BLANCO = (255, 255, 255)
INTER = "/usr/share/fonts/opentype/inter/Inter-{}.otf"

# Casa en un viewBox de 100x100 (tejado + cuerpo, puerta en hueco)
HOUSE = [(50, 20), (82, 46), (82, 80), (18, 80), (18, 46)]
DOOR = [(42, 80), (42, 58), (58, 58), (58, 80)]


def scale(points, k):
    return [(x * k, y * k) for x, y in points]


def make_icon(size, ss=8, radius=0.22, bg=TERRACOTA):
    big = size * ss
    k = big / 100
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, big - 1, big - 1], radius=big * radius, fill=255)
    img.paste(Image.new("RGBA", (big, big), bg + (255,)), (0, 0), mask)
    d = ImageDraw.Draw(img)
    d.polygon(scale(HOUSE, k), fill=BLANCO)
    d.polygon(scale(DOOR, k), fill=bg)
    return img.resize((size, size), Image.LANCZOS)


def save_ico(images, path):
    entries, payload = [], b""
    offset = 6 + 16 * len(images)
    for img in images:
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        data = buf.getvalue()
        entries.append(struct.pack("<BBBBHHII", img.width, img.height, 0, 0, 1, 32, len(data), offset))
        payload += data
        offset += len(data)
    path.write_bytes(struct.pack("<HHH", 0, 1, len(images)) + b"".join(entries) + payload)


def favicons():
    sizes = {16: make_icon(16), 32: make_icon(32), 48: make_icon(48)}
    save_ico(list(sizes.values()), PUBLIC / "favicon.ico")
    sizes[32].save(PUBLIC / "favicon-32x32.png")
    sizes[48].save(PUBLIC / "favicon-48x48.png")
    # iOS no admite transparencia: fondo completo sin esquinas redondeadas
    make_icon(180, radius=0).save(PUBLIC / "apple-touch-icon.png")
    make_icon(192).save(PUBLIC / "icon-192.png")
    make_icon(512).save(PUBLIC / "icon-512.png")
    pts = " ".join(f"{x},{y}" for x, y in HOUSE)
    door = " ".join(f"{x},{y}" for x, y in DOOR)
    (PUBLIC / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n'
        '  <rect width="100" height="100" rx="22" fill="#C45C3E"/>\n'
        f'  <polygon points="{pts}" fill="#fff"/>\n'
        f'  <polygon points="{door}" fill="#C45C3E"/>\n'
        '</svg>\n'
    )


def og_home():
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), CREMA)
    d = ImageDraw.Draw(img)
    # Panel terracota a la derecha con la casa grande
    d.rectangle([800, 0, w, h], fill=TERRACOTA)
    house = make_icon(300, radius=0.0, bg=TERRACOTA)
    img.paste(house, (800 + (400 - 300) // 2, (h - 300) // 2))
    f_title = ImageFont.truetype(INTER.format("Bold"), 84)
    f_sub = ImageFont.truetype(INTER.format("Medium"), 34)
    f_small = ImageFont.truetype(INTER.format("SemiBold"), 26)
    d.text((70, 150), "Bilbao", font=f_title, fill=TERRACOTA)
    d.text((70, 245), "Reforma", font=f_title, fill=GRAFITO)
    d.text((70, 370), "Calcula el presupuesto de tu reforma", font=f_sub, fill=GRAFITO)
    d.text((70, 418), "en Bilbao, Donostia y Vitoria-Gasteiz", font=f_sub, fill=GRAFITO)
    d.rounded_rectangle([70, 500, 70 + 440, 500 + 56], radius=28, fill=TERRACOTA)
    d.text((70 + 220, 528), "Presupuesto gratis · 2 minutos", font=f_small, fill=BLANCO, anchor="mm")
    out = PUBLIC / "images" / "og" / "home-og.jpg"
    img.save(out, quality=88, optimize=True)


if __name__ == "__main__":
    favicons()
    og_home()
    print("ok")
