#!/usr/bin/env python3
"""
Bilbao Blogs - Foreign Fragment Cleanup
Replaces fragments of Chinese, Russian, and Japanese text that were
injected by AI generation with proper Spanish translations or removes them.

Context-aware replacements: each fragment is replaced with the Spanish
text that best fits its surrounding context.
"""

import os
import re
import sys
from pathlib import Path
from collections import Counter
from datetime import datetime

BLOG_DIR = Path("/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/blog")
BACKUP_DIR = Path(f"/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/blog.backup-foreign.{datetime.now().strftime('%Y%m%d-%H%M%S')}")

# Context-aware replacements
# Format: (fragment, replacement, description)
# Each entry was chosen by reading the surrounding context and finding
# the Spanish text that best preserves the original meaning.
REPLACEMENTS = [
    # === Chinese fragments ===
    # "promise/commitment" - in "plazo de ejecución承诺" - redundant
    ('承诺', '',
     '[CN] 承诺 (compromiso) - borrado (redundante con "plazo de ejecución")'),

    # "door/gateway" - in "sin之门 de acceso" → "sin puerta de acceso"
    ('之门 de', 'puerta de',
     '[CN] 之门 (puerta) - "sin puerta de acceso"'),

    # "raise hand" - in "Y al抬手 del presupuesto"
    # "Al抬手" doesn't translate cleanly. The phrase "Y al ___ del presupuesto"
    # doesn't make sense in Spanish either. Likely meant "Y al recibir el
    # presupuesto" but the AI put Chinese instead of Spanish.
    # Best fix: replace with "recibir" to get "Y al recibir del presupuesto" -
    # still awkward. Simplest: delete the fragment, keep "Y al ... del presupuesto"
    # which the user can fix later, OR replace with "Y al alza del" which is
    # an idiom meaning "when prices rise". Going with "recibir" + "el" for clarity:
    ('al抬手 del', 'al recibir el',
     '[CN] 抬手 (levantar mano) - "Y al recibir el del presupuesto" (limpio)'),

    # "truly/really" - in "y真正 surgieron imprevistos" → "y realmente surgieron"
    ('y真正', 'y realmente',
     '[CN] 真正 (realmente) - "y realmente surgieron imprevistos"'),

    # "high frequency use" - "electrodomésticos高频使用" → "electrodomésticos de uso frecuente"
    ('electrodomésticos高频使用', 'electrodomésticos de uso frecuente',
     '[CN] 高频使用 (uso frecuente) - "electrodomésticos de uso frecuente"'),

    # "the best balance between quality and price comes from"
    # "calidad y precio之间" = "between quality and price"
    # "的最佳平衡点来自Roca" = "the best balance point comes from Roca"
    # Clean Spanish: "el mejor equilibrio entre calidad y precio lo tienen Roca, Cex..."
    ('质量和价格之间的最佳平衡点来自', 'el mejor equilibrio entre calidad y precio lo tienen',
     '[CN] 质量和价格之间的最佳平衡点来自 - traducción completa al español'),

    # "can only be unloaded at the street corner"
    # "materiales只能在街口卸货" → "materiales que solo se pueden descargar en la calle"
    ('materiales只能在街口卸货', 'materiales que solo se pueden descargar en la calle',
     '[CN] 只能在街口卸货 - "materiales que solo se pueden descargar en la calle"'),

    # "same" - "siempre en同一个 sitio" → "siempre en el mismo sitio"
    ('siempre en同一个 sitio', 'siempre en el mismo sitio',
     '[CN] 同一个 (el mismo) - "siempre en el mismo sitio"'),

    # "wheelchair" - appears 2 times
    # "para轮椅 acceso" → "para acceso en silla de ruedas"
    # "para quien usa轮椅" → "para quien usa silla de ruedas"
    ('para轮椅', 'para acceso en silla de ruedas',
     '[CN] 轮椅 (silla de ruedas) - "para acceso en silla de ruedas"'),
    ('usa轮椅', 'usa silla de ruedas',
     '[CN] 轮椅 (silla de ruedas) - "usa silla de ruedas"'),

    # "puede haber" - in "y可能有 amianto" → "y puede haber amianto"
    ('y可能有 amianto', 'y puede haber amianto',
     '[CN] 可能有 (puede haber) - "y puede haber amianto"'),

    # === Russian (Cyrillic) fragments ===
    # "ya" - "la ventilación es уже de por sí problemática" → "ya de por sí problemática"
    ('es уже de por sí', 'es ya de por sí',
     '[RU] уже (ya) - "ya de por sí problemática"'),

    # "it/esto" - "Sin него, se reseca" → "Sin esto, se reseca"
    ('Sin него,', 'Sin esto,',
     '[RU] него (esto) - "Sin esto, se reseca"'),

    # "discovers" - "se обнаруживает que" → "se descubre que"
    ('se обнаруживает que', 'se descubre que',
     '[RU] обнаруживает (descubre) - "se descubre que"'),

    # "cuarzo" - "Encimera de кварц" → "Encimera de cuarzo"
    ('de кварц', 'de cuarzo',
     '[RU] кварц (cuarzo) - "Encimera de cuarzo"'),

    # "particularidades" - "y особенности de los pisos" → "y particularidades de los pisos"
    ('y особенности de', 'y particularidades de',
     '[RU] особенности (particularidades) - "y particularidades de los pisos"'),

    # "comida para llevar" - "depender de外卖" → "depender de comida para llevar"
    ('depender de外卖', 'depender de comida para llevar',
     '[CN] 外卖 (comida para llevar) - "depender de comida para llevar"'),

    # "frontales" - "con фронтальные panels" → "con paneles frontales"
    ('фронтальные panels', 'paneles frontales',
     '[RU] фронтальные (frontales) - "paneles frontales"'),

    # "después" - "puedes позже financia" → "puedes después financiar"
    ('puedes позже financia', 'puedes después financiar',
     '[RU] позже (después) - "puedes después financiar"'),

    # "subvenciones" - "субсидии hasta 6.000 €" → "subvenciones de hasta 6.000 €"
    ('субсидии hasta', 'subvenciones de hasta',
     '[RU] субсидии (subvenciones) - "subvenciones de hasta 6.000 €"'),

    # "algunos" - "某些 ayuntamientos ofrecen" → "algunos ayuntamientos ofrecen"
    ('某些 ayuntamientos', 'algunos ayuntamientos',
     '[CN] 某些 (algunos) - "algunos ayuntamientos"'),

    # "proyecto" + "regularizado" - mixed Russian + Chinese fragment
    # "necesita проект técnico正規ado" → "necesita un proyecto técnico regularizado"
    ('проект técnico正規ado', 'un proyecto técnico regularizado',
     '[RU+CN mix] проект técnico正規ado - "un proyecto técnico regularizado"'),

    # === Japanese fragments ===
    # "postindustrial" - "la Bilbao deポストindustrial" → "la Bilbao postindustrial"
    ('la Bilbao deポストindustrial', 'la Bilbao postindustrial',
     '[JP] ポスト (post) - "la Bilbao postindustrial"'),

    # "comunitaria" - "Pintura общины" → "Pintura comunitaria"
    ('Pintura общины,', 'Pintura comunitaria,',
     '[RU] общины (comunitaria) - "Pintura comunitaria"'),

    # "arquitectónicas" - "barreras архитектурные" → "barreras arquitectónicas"
    ('barreras архитектурные', 'barreras arquitectónicas',
     '[RU] архитектурные (arquitectónicas) - "barreras arquitectónicas"'),
]


def get_blog_files():
    files = []
    for f in BLOG_DIR.iterdir():
        if not f.is_file():
            continue
        if f.name.startswith('BRIEF'):
            continue
        if f.name.endswith('.new'):
            continue
        if f.suffix == '.html':
            files.append(f)
    return sorted(files)


def clean_file(filepath, replacement_counts):
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    cleaned = original
    for old, new, desc in REPLACEMENTS:
        count = cleaned.count(old)
        if count > 0:
            cleaned = cleaned.replace(old, new)
            replacement_counts[(old, new, desc)] += count

    if cleaned != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        return True
    return False


def validate_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    issues = []
    for tag in ['html', 'head', 'body', 'main', 'article', 'section', 'div', 'p', 'h1', 'h2', 'h3', 'span', 'a']:
        opens = len(re.findall(rf'<{tag}(?:\s[^>]*?)?>', content))
        closes = len(re.findall(rf'</{tag}>', content))
        if opens != closes:
            issues.append(f'{tag}: {opens} open, {closes} close')
    return issues


def main():
    print('=' * 70)
    print('Bilbao Blogs - Foreign Fragment Cleanup')
    print('=' * 70)

    files = get_blog_files()
    print(f'\n[1/4] Found {len(files)} blog HTML files')

    print(f'\n[2/4] Creating backup at: {BACKUP_DIR.name}')
    import shutil
    shutil.copytree(BLOG_DIR, BACKUP_DIR)
    print(f'      Backup created')

    print(f'\n[3/4] Applying {len(REPLACEMENTS)} targeted translations...')
    replacement_counts = Counter()
    files_changed = 0
    for filepath in files:
        if clean_file(filepath, replacement_counts):
            files_changed += 1

    print(f'      Files changed: {files_changed}/{len(files)}')
    print(f'      Total replacements: {sum(replacement_counts.values())}')
    print(f'\n      Replacements applied:')
    for (old, new, desc), count in sorted(replacement_counts.items(), key=lambda x: -x[1]):
        if count > 0:
            print(f'        [{count}x] {desc}')
            print(f'              {repr(old):30s} → {repr(new)}')

    print(f'\n[4/4] Validating HTML...')
    all_issues = []
    for filepath in files:
        issues = validate_html(filepath)
        if issues:
            all_issues.append((filepath.name, issues))

    if all_issues:
        print(f'      ⚠️  Issues in {len(all_issues)} files:')
        for fname, issues in all_issues[:5]:
            print(f'        {fname}: {issues}')
    else:
        print(f'      ✅ All {len(files)} files valid')

    # Final check: any remaining foreign chars
    print(f'\n[FINAL] Scanning for remaining foreign characters...')
    asian_pattern = re.compile(r'[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\u3400-\u4DBF\u0400-\u04FF]')
    remaining = Counter()
    files_with_remaining = []
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        matches = asian_pattern.findall(content)
        for m in matches:
            remaining[m] += 1
        if matches:
            files_with_remaining.append((filepath.name, len(matches)))

    if remaining:
        print(f'      ⚠️  Remaining foreign chars: {sum(remaining.values())}')
        for c, n in remaining.most_common():
            print(f'        {repr(c)} (U+{ord(c):04X}): {n}')
        print(f'      Files still affected: {len(files_with_remaining)}')
    else:
        print(f'      ✅ All foreign characters removed!')

    print(f'\n{"=" * 70}')
    print(f'DONE')
    print(f'  Files processed: {len(files)}')
    print(f'  Files changed: {files_changed}')
    print(f'  Total translations: {sum(replacement_counts.values())}')
    print(f'  Backup: {BACKUP_DIR.name}')
    print(f'{"=" * 70}')

    return 0 if not all_issues else 1


if __name__ == '__main__':
    sys.exit(main())