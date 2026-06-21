#!/usr/bin/env python3
"""
Gen favicons per-marca (ciclo 2) — compatible con Pillow 7.0 (sin rounded_rectangle).

Replica el data URI actual:
  <rect fill='#C45C3E' rx='12' width='100' height='100'/>
  <text x='50' y='68' font-size='50' text-anchor='middle' fill='white'>{LETRA}</text>

Implementa `rounded_rectangle` pintando el fondo y luego enmascarando con un
círculo α para las 4 esquinas, todo sobre imagen RGBA.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import struct
import io

ROOT = Path("/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora")
BG = "#C45C3E"
FG = "white"
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def hex_to_rgb(h: str):
    """Acepta hex (#fff, ffffff) o nombre CSS ('white')."""
    if isinstance(h, str) and h.startswith("#"):
        h = h.lstrip("#")
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    named = {"white": (255, 255, 255), "black": (0, 0, 0)}
    return named.get(h.lower(), (255, 255, 255))


def rounded_rect_mask(size: int, radius: int) -> Image.Image:
    """Máscara L (0/255) con esquinas redondeadas. Compatible Pillow 7."""
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle = None  # placeholder por si PIL antiguo la trae parcial
    # Pillow 7 no tiene rounded_rectangle: pintamos rectángulo y enmascaramos
    # las 4 esquinas con círculos blancos.
    d.rectangle([(0, 0), (size - 1, size - 1)], fill=255)
    if radius > 0:
        d.ellipse([(0, 0), (radius * 2, radius * 2)], fill=0)
        d.ellipse([(size - radius * 2, 0), (size, radius * 2)], fill=0)
        d.ellipse([(0, size - radius * 2), (radius * 2, size)], fill=0)
        d.ellipse([(size - radius * 2, size - radius * 2), (size, size)], fill=0)
    return mask


def make_icon(size: int, letter: str):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    radius = int(size * 0.12)  # 12% (rx=12 sobre viewBox 100)
    mask = rounded_rect_mask(size, radius)

    # Fondo: pintamos toda la imagen y aplicamos máscara
    bg_layer = Image.new("RGBA", (size, size), hex_to_rgb(BG) + (255,))
    img.paste(bg_layer, (0, 0), mask)

    # Texto
    font_size = int(size * 0.55)
    font = ImageFont.truetype(FONT_PATH, font_size)
    # Pillow 7 no tiene textbbox → usamos textsize (devuelve (w, h))
    w, h = d.textsize(letter, font=font)
    x = (size - w) / 2
    # Centrado vertical + pequeño offset hacia abajo para alinear baseline
    # con la posición y=68 del SVG (ligeramente bajo centro visual).
    y = (size - h) / 2 + int(size * 0.05)
    d.text((x, y), letter, fill=hex_to_rgb(FG), font=font)
    return img


def save_svg(path: Path, letter: str):
    content = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n'
        f'  <rect fill="#{BG.lstrip("#").upper()}" rx="12" width="100" height="100"/>\n'
        f'  <text x="50" y="68" font-size="50" text-anchor="middle" fill="white" '
        f'font-family="Arial, Helvetica, sans-serif" font-weight="bold">{letter}</text>\n'
        '</svg>\n'
    )
    path.write_text(content, encoding="utf-8")


def make_multi_ico(images: dict, out_path: Path):
    """Genera ICO multi-size con PNG embebido (16/32/48 por defecto).
    images: dict {(w, h): PIL.Image.RGBA}.
    """
    entries = []
    payload = b""
    offset = 6 + 16 * len(images)
    sorted_keys = sorted(images.keys(), key=lambda s: s[0])
    for (w, h) in sorted_keys:
        img = images[(w, h)]
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        png_bytes = buf.getvalue()
        iw = 0 if w == 256 else w
        ih = 0 if h == 256 else h
        entries.append(struct.pack(
            "<BBBBHHII", iw, ih, 0, 0, 1, 32, len(png_bytes), offset
        ))
        payload += png_bytes
        offset += len(png_bytes)
    header = struct.pack("<HHH", 0, 1, len(images))
    out_path.write_bytes(header + b"".join(entries) + payload)


def gen_ico(out_dir: Path, letter: str, base_name: str = "favicon"):
    out_dir.mkdir(parents=True, exist_ok=True)
    sizes = [(16, 16), (32, 32), (48, 48)]
    imgs = {s: make_icon(s[0], letter) for s in sizes}

    ico_path = out_dir / f"{base_name}.ico"
    make_multi_ico(imgs, ico_path)

    if base_name == "favicon":
        imgs[(32, 32)].save(out_dir / "favicon-32x32.png", "PNG")
        imgs[(48, 48)].save(out_dir / "favicon-48x48.png", "PNG")
        make_icon(180, letter).save(out_dir / "apple-touch-icon.png", "PNG")
        save_svg(out_dir / "favicon.svg", letter)


def gen_donostia():
    out = ROOT / "donostia"
    print(f"[*] Donostia → {out}")
    gen_ico(out, "D")


def gen_vitoria():
    out = ROOT / "vitoria"
    print(f"[*] Vitoria  → {out}")
    gen_ico(out, "V")


def gen_empresa(slug: str, letter: str):
    out = ROOT / "empresas"
    base = f"favicon-{slug}"
    print(f"[*] Empresa {slug} (letra {letter}) → {out}/{base}.{{ico,png}}")
    gen_ico(out, letter, base_name=base)


if __name__ == "__main__":
    gen_donostia()
    gen_vitoria()
    gen_empresa("raquel-gonzalez-interiorismo", "R")
    gen_empresa("reformas-fernandez", "F")
    gen_empresa("reformas-zunzunegui", "Z")
    print("\n[OK] Favicons generados.")
