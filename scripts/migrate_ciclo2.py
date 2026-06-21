#!/usr/bin/env python3
"""
Migración ciclo 2: reemplaza los data URIs por referencias a /marca/favicon.*

- Donostia (10 HTML): letra D → /donostia/favicon.{ico,svg,png}
- Vitoria  (12 HTML): letra V → /vitoria/favicon.{ico,svg,png}
- Empresas (3 HTML):  R / F / Z → /empresas/favicon-<slug>.{ico,png}
- Bug fix: blog/reforma-bano-pequeno-bilbao.html
  → /favicon.{ico,svg,png} (raíz, Bilbao)
  → corrige typo image/svgxml → image/svg+xml

Idempotente: si el HTML ya referencia /marca/favicon.ico, no toca nada.
"""
from pathlib import Path
import re
import sys

ROOT = Path("/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora")

# ---------------------------------------------------------------------------
# Data URI exactos a buscar (todos comparten rx=12, color #C45C3E, white)
# ---------------------------------------------------------------------------
DATA_URI_TEMPLATE = (
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>"
    "<rect fill='%23C45C3E' rx='12' width='100' height='100'/>"
    "<text x='50' y='68' font-size='50' text-anchor='middle' "
    "fill='white'>{LETTER}</text></svg>"
)

# Mapeo letra → set de hrefs (rel paths, sin slash inicial)
LETTER_TO_PREFIX = {
    "D": "/donostia/",
    "V": "/vitoria/",
    "R": "/empresas/favicon-raquel-gonzalez-interiorismo",
    "F": "/empresas/favicon-reformas-fernandez",
    "Z": "/empresas/favicon-reformas-zunzunegui",
}

# Empresas sólo generan ICO (multi-size); en el HTML referenciamos ICO + 32x32
EMPRESA_SLUGS = {"R", "F", "Z"}


def build_block(letter: str, indent: str = "  ") -> str:
    """Construye el bloque de 5 (o 2) líneas <link rel="icon">."""
    if letter in EMPRESA_SLUGS:
        base = LETTER_TO_PREFIX[letter]
        return (
            f'{indent}<link rel="icon" href="{base}.ico" sizes="any">\n'
            f'{indent}<link rel="icon" type="image/png" sizes="32x32" '
            f'href="{base}-32x32.png">'
        )
    pref = LETTER_TO_PREFIX[letter]
    return (
        f'{indent}<link rel="icon" href="{pref}favicon.ico" sizes="any">\n'
        f'{indent}<link rel="icon" type="image/svg+xml" '
        f'href="{pref}favicon.svg">\n'
        f'{indent}<link rel="icon" type="image/png" sizes="32x32" '
        f'href="{pref}favicon-32x32.png">\n'
        f'{indent}<link rel="icon" type="image/png" sizes="48x48" '
        f'href="{pref}favicon-48x48.png">\n'
        f'{indent}<link rel="apple-touch-icon" sizes="180x180" '
        f'href="{pref}apple-touch-icon.png">'
    )


def build_bilbao_block(indent: str = "  ") -> str:
    """Bloque para ficheros raíz Bilbao (con /favicon.* en raíz)."""
    return (
        f'{indent}<link rel="icon" href="/favicon.ico" sizes="any">\n'
        f'{indent}<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n'
        f'{indent}<link rel="icon" type="image/png" sizes="32x32" '
        f'href="/favicon-32x32.png">\n'
        f'{indent}<link rel="icon" type="image/png" sizes="48x48" '
        f'href="/favicon-48x48.png">\n'
        f'{indent}<link rel="apple-touch-icon" sizes="180x180" '
        f'href="/apple-touch-icon.png">'
    )


# Detecta el data URI y captura la letra, sin importar indentación
RE_DATA_URI = re.compile(
    r'^(\s*)<link rel="icon" type="image/svg\+xml" '
    r'href="data:image/svg\+xml,<svg xmlns=\'http://www\.w3\.org/2000/svg\''
    r' viewBox=\'0 0 100 100\'><rect fill=\'%23C45C3E\' rx=\'12\' '
    r'width=\'100\' height=\'100\'/><text x=\'50\' y=\'68\' '
    r'font-size=\'50\' text-anchor=\'middle\' fill=\'white\'>([A-Z])'
    r'</text></svg>">\s*$'
)

# Bug fix: typo svgxml (sin +)
RE_TYPO_DATA_URI = re.compile(
    r'^(\s*)<link rel="icon" type="image/svgxml" '
    r'href="data:image/svg\+xml,<svg xmlns=\'http://www\.w3\.org/2000/svg\''
    r' viewBox=\'0 0 100 100\'><rect fill=\'%23C45C3E\' rx=\'12\' '
    r'width=\'100\' height=\'100\'/><text x=\'50\' y=\'68\' '
    r'font-size=\'50\' text-anchor=\'middle\' fill=\'white\'>([A-Z])'
    r'</text></svg>">\s*$'
)


def migrate_data_uri(html_path: Path, base_block=None, expected_letter=None):
    """Reemplaza la línea data URI por el bloque apropiado.
    base_block: callable(indent) → str; si None se deriva de la letra.
    expected_letter: filtra por letra (None acepta cualquiera).
    """
    text = html_path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=False)
    new_lines = []
    replaced = 0

    for line in lines:
        m = RE_DATA_URI.match(line)
        if m:
            indent = m.group(1)
            letter = m.group(2)
            if expected_letter is not None and letter != expected_letter:
                # No es la letra que esperábamos; dejamos la línea tal cual
                new_lines.append(line)
                continue
            if base_block is None:
                if letter not in LETTER_TO_PREFIX:
                    print(f"  ⚠ Letra desconocida '{letter}' en {html_path}")
                    new_lines.append(line)
                    continue
                block = build_block(letter, indent)
            else:
                block = base_block(indent)
            new_lines.append(block)
            replaced += 1
        else:
            new_lines.append(line)

    if replaced == 0:
        print(f"  ⚠ No se encontró data URI en {html_path}")
        return False

    html_path.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
    print(f"  ✓ {html_path.relative_to(ROOT)} ({replaced} línea reemplazada)")
    return True


def migrate_bano_pequeno(html_path: Path):
    """Maneja blog/reforma-bano-pequeno-bilbao.html con typo svgxml."""
    text = html_path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=False)
    new_lines = []
    replaced_typo = 0
    replaced_data = 0

    for line in lines:
        # Caso 1: typo image/svgxml
        m_typo = RE_TYPO_DATA_URI.match(line)
        if m_typo:
            indent = m_typo.group(1)
            letter = m_typo.group(2)
            if letter != "B":
                print(f"  ⚠ Letra inesperada '{letter}' en {html_path}")
                new_lines.append(line)
                continue
            block = build_bilbao_block(indent)
            new_lines.append(block)
            replaced_typo += 1
            continue

        # Caso 2: data URI normal (por si también existiera)
        m_data = RE_DATA_URI.match(line)
        if m_data:
            indent = m_data.group(1)
            letter = m_data.group(2)
            if letter != "B":
                new_lines.append(line)
                continue
            block = build_bilbao_block(indent)
            new_lines.append(block)
            replaced_data += 1
            continue

        new_lines.append(line)

    total = replaced_typo + replaced_data
    if total == 0:
        print(f"  ⚠ No se encontró ni typo ni data URI en {html_path}")
        return False

    html_path.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
    print(f"  ✓ {html_path.relative_to(ROOT)} "
          f"(typo:{replaced_typo}, data:{replaced_data})")
    return True


def main():
    summary = {"donostia_ok": 0, "vitoria_ok": 0, "empresa_ok": 0, "bano_ok": 0}

    # ---- Donostia (10) ----
    print("\n=== Donostia (10 HTML, letra D) ===")
    donostia_files = [
        "donostia/index.html",
        "donostia/blog/index.html",
        "donostia/calculadora/index.html",
        "donostia/empresas/index.html",
        "donostia/blog/bano-reforma-donostia.html",
        "donostia/blog/pintar-piso-donostia.html",
        "donostia/blog/reforma-cocina-donostia.html",
        "donostia/blog/reforma-integral-donostia.html",
        "donostia/blog/subvenciones-reformas-donostia.html",
        "donostia/blog/suelo-madera-donostia.html",
    ]
    for rel in donostia_files:
        p = ROOT / rel
        if not p.exists():
            print(f"  ✗ MISSING: {rel}")
            continue
        if migrate_data_uri(p, expected_letter="D"):
            summary["donostia_ok"] += 1

    # ---- Vitoria (12) ----
    print("\n=== Vitoria (12 HTML, letra V) ===")
    vitoria_files = [
        "vitoria/index.html",
        "vitoria/blog/index.html",
        "vitoria/calculadora/index.html",
        "vitoria/empresas/index.html",
        "vitoria/empresas/ara-reformas.html",
        "vitoria/empresas/renova-gasteiz.html",
        "vitoria/blog/bano-reforma-vitoria.html",
        "vitoria/blog/pintar-piso-vitoria.html",
        "vitoria/blog/precio-reforma-integral-vitoria.html",
        "vitoria/blog/reforma-cocina-vitoria.html",
        "vitoria/blog/subvenciones-reformas-vitoria.html",
        "vitoria/blog/suelo-madera-vitoria.html",
    ]
    for rel in vitoria_files:
        p = ROOT / rel
        if not p.exists():
            print(f"  ✗ MISSING: {rel}")
            continue
        if migrate_data_uri(p, expected_letter="V"):
            summary["vitoria_ok"] += 1

    # ---- Empresas (3) ----
    print("\n=== Empresas (3 HTML) ===")
    empresa_files = [
        ("empresas/raquel-gonzalez-interiorismo.html", "R"),
        ("empresas/reformas-fernandez.html", "F"),
        ("empresas/reformas-zunzunegui.html", "Z"),
    ]
    for rel, letter in empresa_files:
        p = ROOT / rel
        if not p.exists():
            print(f"  ✗ MISSING: {rel}")
            continue
        if migrate_data_uri(p, expected_letter=letter):
            summary["empresa_ok"] += 1

    # ---- Bug fix: blog/reforma-bano-pequeno-bilbao.html ----
    print("\n=== Bug fix: blog/reforma-bano-pequeno-bilbao.html ===")
    bano = ROOT / "blog" / "reforma-bano-pequeno-bilbao.html"
    if bano.exists():
        if migrate_bano_pequeno(bano):
            summary["bano_ok"] = 1
    else:
        print(f"  ✗ MISSING: {bano}")

    print("\n=== Resumen ===")
    for k, v in summary.items():
        print(f"  {k}: {v}")
    return summary


if __name__ == "__main__":
    main()
