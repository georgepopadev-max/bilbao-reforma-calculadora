#!/usr/bin/env python3
"""
Generate specific og:image files for Bilbao Reforma.
Creates category-specific OG images using PIL, matching the style of existing ones.
"""
from PIL import Image, ImageDraw, ImageFont
import os
import sys

# Paths
PUBLIC_OG_DIR = 'public/images/og'
DIST_OG_DIR = 'dist/images/og'
os.makedirs(PUBLIC_OG_DIR, exist_ok=True)
os.makedirs(DIST_OG_DIR, exist_ok=True)

# Colors (matching existing design)
NAVY = (15, 32, 62)       # Dark navy blue
WHITE = (255, 255, 255)
RED = (178, 34, 52)        # Deep red accent
LIGHT_GRAY = (248, 248, 248)
BLACK = (20, 20, 20)

WIDTH, HEIGHT = 1200, 630

def load_font(size, bold=False):
    """Try to load a suitable font."""
    font_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf' if bold else '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                pass
    return ImageFont.load_default()


def fit_text(draw, text, max_width, font):
    """Return text that fits within max_width, truncating with '...' if needed."""
    w, h = draw.textsize(text, font=font)
    if w <= max_width:
        return text
    # Binary search for max chars that fit
    lo, hi = 0, len(text)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        test = text[:mid]
        w, h = draw.textsize(test, font=font)
        if w <= max_width:
            lo = mid
        else:
            hi = mid - 1
    # Find a good truncation point (prefer word/separator boundary)
    truncated = text[:lo]
    for i in range(len(truncated) - 1, -1, -1):
        if truncated[i] in ' ·—-|':
            truncated = truncated[:i]
            break
    ellipsis = '…'
    w, h = draw.textsize(truncated + ellipsis, font=font)
    if w > max_width:
        # Last resort: character-by-character
        for i in range(len(truncated) - 1, -1, -1):
            w, h = draw.textsize(truncated[:i] + ellipsis, font=font)
            if w <= max_width:
                truncated = truncated[:i]
                break
    return truncated + ellipsis

def create_og_image(city_text, subtitle, footer_text, output_path):
    """Create an OG image with the standard Bilbao Reforma layout."""
    img = Image.new('RGB', (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(img)

    font_subtitle = load_font(36, bold=False)
    font_banner = load_font(28, bold=True)
    # Use 80px for long city names to guarantee they fit on 1200px canvas
    city_font_size = 120 if len(city_text) <= 8 else (120 if len(city_text) <= 10 else 90)
    font_city_main = load_font(city_font_size, bold=True)

    # Top banner (navy)
    draw.rectangle([(0, 0), (WIDTH, 70)], fill=NAVY)
    draw.text((WIDTH // 2, 35), "BILBAO · VITORIA · DONOSTIA", fill=WHITE, font=font_banner, anchor='mm')
    # Red accent line below top banner
    draw.rectangle([(0, 70), (WIDTH, 74)], fill=RED)

    # Main area
    draw.rectangle([(0, 74), (WIDTH, HEIGHT - 70)], fill=WHITE)

    # City name (large, centered) — fit to available width
    city_y = 280
    max_city_width = WIDTH - 120
    city_display = fit_text(draw, city_text, max_city_width, font_city_main)
    draw.text((WIDTH // 2, city_y), city_display, fill=NAVY, font=font_city_main, anchor='mm')

    # Subtitle — fit to available width
    subtitle_y = city_y + 110
    max_sub_width = WIDTH - 100
    subtitle_display = fit_text(draw, subtitle, max_sub_width, font_subtitle)
    draw.text((WIDTH // 2, subtitle_y), subtitle_display, fill=NAVY, font=font_subtitle, anchor='mm')

    # Bottom banner (navy)
    banner_top = HEIGHT - 70
    draw.rectangle([(0, banner_top), (WIDTH, HEIGHT)], fill=NAVY)
    # Red accent line above bottom banner
    draw.rectangle([(0, banner_top), (WIDTH, banner_top + 4)], fill=RED)

    # Footer text — fit to width
    footer_display = fit_text(draw, footer_text, WIDTH - 100, font_banner)
    draw.text((WIDTH // 2, HEIGHT - 35), footer_display, fill=WHITE, font=font_banner, anchor='mm')

    img.save(output_path, 'JPEG', quality=90, optimize=True)
    print(f"  Created: {output_path}")

def create_calc_og_image(calc_type, city_name, output_path):
    """Create OG image for calculator pages."""
    calc_labels = {
        'bano': 'Reforma de Baño',
        'cocina': 'Reforma de Cocina',
        'integral': 'Reforma Integral',
        'pintura': 'Pintura',
        'suelo': 'Cambio de Suelo',
    }
    label = calc_labels.get(calc_type, 'Reforma')
    city_text = city_name
    # Use shorter subtitle to avoid truncation on 1200px canvas
    subtitle = f"{label} — Calculadora"
    footer = "Calcula gratis · Empresas verificadas"
    create_og_image(city_text, subtitle, footer, output_path)

def create_article_og_image(title, category, output_path):
    """Create OG image for article/guide pages."""
    img = Image.new('RGB', (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(img)

    font_title = load_font(56, bold=True)
    font_subtitle = load_font(32, bold=False)
    font_banner = load_font(28, bold=True)

    # Top banner
    draw.rectangle([(0, 0), (WIDTH, 70)], fill=NAVY)
    draw.text((WIDTH // 2, 35), "BILBAO REFORMA", fill=WHITE, font=font_banner, anchor='mm')
    draw.rectangle([(0, 70), (WIDTH, 74)], fill=RED)

    # Main area
    draw.rectangle([(0, 74), (WIDTH, HEIGHT - 70)], fill=WHITE)

    # Category tag
    draw.text((WIDTH // 2, 200), category.upper(), fill=RED, font=load_font(24, bold=True), anchor='mm')

    # Title (truncated if needed)
    max_chars = 50
    display_title = title if len(title) <= max_chars else title[:max_chars-3] + '...'
    draw.text((WIDTH // 2, 300), display_title, fill=NAVY, font=font_title, anchor='mm')

    # Subtitle
    draw.text((WIDTH // 2, 400), "bilbaoreforma.es", fill=(120, 120, 120), font=load_font(28), anchor='mm')

    # Bottom banner
    banner_top = HEIGHT - 70
    draw.rectangle([(0, banner_top), (WIDTH, HEIGHT)], fill=NAVY)
    draw.rectangle([(0, banner_top), (WIDTH, banner_top + 4)], fill=RED)
    draw.text((WIDTH // 2, HEIGHT - 35), "Guía práctica 2026", fill=WHITE, font=font_banner, anchor='mm')

    img.save(output_path, 'JPEG', quality=90, optimize=True)
    print(f"  Created: {output_path}")

def create_legal_og_image(pagename, output_path):
    """Create OG image for legal/contact pages."""
    img = Image.new('RGB', (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(img)

    font_main = load_font(70, bold=True)
    font_sub = load_font(36, bold=False)
    font_banner = load_font(28, bold=True)

    # Top banner
    draw.rectangle([(0, 0), (WIDTH, 70)], fill=NAVY)
    draw.text((WIDTH // 2, 35), "BILBAO REFORMA", fill=WHITE, font=font_banner, anchor='mm')
    draw.rectangle([(0, 70), (WIDTH, 74)], fill=RED)

    # Main area
    draw.rectangle([(0, 74), (WIDTH, HEIGHT - 70)], fill=WHITE)

    # Page name
    draw.text((WIDTH // 2, 280), pagename, fill=NAVY, font=font_main, anchor='mm')
    draw.text((WIDTH // 2, 370), "bilbaoreforma.es", fill=(120, 120, 120), font=font_sub, anchor='mm')

    # Bottom banner
    banner_top = HEIGHT - 70
    draw.rectangle([(0, banner_top), (WIDTH, HEIGHT)], fill=NAVY)
    draw.rectangle([(0, banner_top), (WIDTH, banner_top + 4)], fill=RED)
    draw.text((WIDTH // 2, HEIGHT - 35), "Información legal y contacto", fill=WHITE, font=font_banner, anchor='mm')

    img.save(output_path, 'JPEG', quality=90, optimize=True)
    print(f"  Created: {output_path}")

def create_empresa_og_image(nombre, output_path):
    """Create OG image for empresa pages."""
    img = Image.new('RGB', (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(img)

    font_main = load_font(60, bold=True)
    font_sub = load_font(32, bold=False)
    font_banner = load_font(28, bold=True)

    # Top banner
    draw.rectangle([(0, 0), (WIDTH, 70)], fill=NAVY)
    draw.text((WIDTH // 2, 35), "EMPRESA VERIFICADA", fill=WHITE, font=font_banner, anchor='mm')
    draw.rectangle([(0, 70), (WIDTH, 74)], fill=RED)

    # Main area
    draw.rectangle([(0, 74), (WIDTH, HEIGHT - 70)], fill=WHITE)

    # Nombre empresa
    max_chars = 40
    display_name = nombre if len(nombre) <= max_chars else nombre[:max_chars-3] + '...'
    draw.text((WIDTH // 2, 280), display_name, fill=NAVY, font=font_main, anchor='mm')
    draw.text((WIDTH // 2, 360), "Reformas en Bilbao y Bizkaia", fill=(120, 120, 120), font=font_sub, anchor='mm')
    draw.text((WIDTH // 2, 410), "bilbaoreforma.es", fill=(120, 120, 120), font=load_font(24), anchor='mm')

    # Bottom banner
    banner_top = HEIGHT - 70
    draw.rectangle([(0, banner_top), (WIDTH, HEIGHT)], fill=NAVY)
    draw.rectangle([(0, banner_top), (WIDTH, banner_top + 4)], fill=RED)
    draw.text((WIDTH // 2, HEIGHT - 35), "Empresa verificada por Bilbao Reforma", fill=WHITE, font=font_banner, anchor='mm')

    img.save(output_path, 'JPEG', quality=90, optimize=True)
    print(f"  Created: {output_path}")


if __name__ == '__main__':
    print("Generating og:image files for Bilbao Reforma...")

    # City-specific OG images (calculator pages)
    cities = {
        'bilbao': 'Bilbao',
        'donostia': 'Donostia',
        'vitoria': 'Vitoria',
    }
    calc_types = ['bano', 'cocina', 'integral', 'pintura', 'suelo']

    for city_slug, city_name in cities.items():
        for calc_type in calc_types:
            filename = f"{city_slug}-{calc_type}-og.jpg"
            public_path = os.path.join(PUBLIC_OG_DIR, filename)
            create_calc_og_image(calc_type, city_name, public_path)

    # Ciudad hub pages
    for city_slug, city_name in cities.items():
        if city_slug == 'bilbao':
            continue  # bilbao-og.jpg already exists
        filename = f"{city_slug}-og.jpg"
        public_path = os.path.join(PUBLIC_OG_DIR, filename)
        if not os.path.exists(public_path):
            create_og_image(city_name, "Calculadora de presupuestos de reforma 2026",
                          "Calcula gratis · Empresas verificadas", public_path)

    # Blog hub
    blog_hub_path = os.path.join(PUBLIC_OG_DIR, 'blog-og.jpg')
    if not os.path.exists(blog_hub_path):
        create_og_image("Bilbao Reforma", "Blog — Guías y consejos para tu reforma",
                       "Artículos actualizados 2026", blog_hub_path)

    # Calculadora hub
    create_og_image("Calculadora", "Presupuestos de reforma 2026",
                   "Bilbao · Vitoria · Donostia", os.path.join(PUBLIC_OG_DIR, 'calculadora-og.jpg'))

    # Legal pages
    create_legal_og_image("Aviso Legal", os.path.join(PUBLIC_OG_DIR, 'aviso-legal-og.jpg'))
    create_legal_og_image("Política de Privacidad", os.path.join(PUBLIC_OG_DIR, 'privacidad-og.jpg'))
    create_legal_og_image("Contacto", os.path.join(PUBLIC_OG_DIR, 'contacto-og.jpg'))
    create_legal_og_image("Sobre Nosotros", os.path.join(PUBLIC_OG_DIR, 'sobre-nosotros-og.jpg'))

    # Reformas Bilbao hub
    create_og_image("Bilbao", "Guía de Reformas 2026",
                   "Calcula gratis · Empresas verificadas", os.path.join(PUBLIC_OG_DIR, 'reformas-bilbao-og.jpg'))

    # Presupuesto Bilbao hub
    create_og_image("Bilbao", "Presupuesto de Reforma 2026",
                   "Calcula gratis · Empresas verificadas", os.path.join(PUBLIC_OG_DIR, 'presupuesto-bilbao-og.jpg'))

    # Empresas hub
    create_og_image("Empresas", "Empresas de Reformas Verificadas",
                   "Bilbao · Vitoria · Donostia", os.path.join(PUBLIC_OG_DIR, 'empresas-og.jpg'))

    # Copy to dist
    import shutil
    for f in os.listdir(PUBLIC_OG_DIR):
        src = os.path.join(PUBLIC_OG_DIR, f)
        dst = os.path.join(DIST_OG_DIR, f)
        shutil.copy2(src, dst)

    print("\nDone! OG images generated:")
    for f in sorted(os.listdir(PUBLIC_OG_DIR)):
        print(f"  {f}")
