#!/usr/bin/env python3
"""Extract title and description from all .astro pages (all layout types, handles JS vars)."""
import os
import re
import glob

pages_dir = "/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/src/pages"
files = glob.glob(f"{pages_dir}/**/*.astro", recursive=True)
files = sorted(files)

LAYOUTS = ['BaseLayout', 'CityLayout', 'CalculadoraLayout', 'BlogLayout', 'EmpresaLayout', 'HubLayout']

results = []

for fpath in files:
    rel = os.path.relpath(fpath, pages_dir)
    with open(fpath, 'r') as f:
        content = f.read()
    
    title = None
    description = None
    
    # Find any layout tag
    layout_match = re.search(r'<(BaseLayout|CityLayout|CalculadoraLayout|BlogLayout|EmpresaLayout|HubLayout)\b([^>]*?)(?:/>|>)', content, re.DOTALL)
    
    if layout_match:
        props_str = layout_match.group(2)
        
        # Try simple string first: title="..."
        title_match = re.search(r'\btitle="([^"]*)"', props_str)
        if title_match:
            title = title_match.group(1)
        else:
            # Try template literal: title={`...`}
            title_match = re.search(r'\btitle=\{\`([^\`]*)\`\}', props_str)
            if title_match:
                title = title_match.group(1)
            else:
                # Try variable: title={titleVar} or title={someVar}
                title_var_match = re.search(r'\btitle=\{(\w+)\}', props_str)
                if title_var_match:
                    var_name = title_var_match.group(1)
                    # Look for const/let/var declaration in frontmatter
                    var_match = re.search(rf'\b(?:const|let|var)\s+{var_name}\s*=\s*(?:\'([^\']*)\'|"([^"]*)"|\`([^\`]*)\`)', content)
                    if var_match:
                        title = var_match.group(1) or var_match.group(2) or var_match.group(3)
        
        # Try simple string first: description="..."
        desc_match = re.search(r'\bdescription="([^"]*)"', props_str)
        if desc_match:
            description = desc_match.group(1)
        else:
            # Try template literal: description={`...`}
            desc_match = re.search(r'\bdescription=\{\`([^\`]*)\`\}', props_str)
            if desc_match:
                description = desc_match.group(1)
            else:
                # Try variable: description={descVar}
                desc_var_match = re.search(r'\bdescription=\{(\w+)\}', props_str)
                if desc_var_match:
                    var_name = desc_var_match.group(1)
                    var_match = re.search(rf'\b(?:const|let|var)\s+{var_name}\s*=\s*(?:\'([^\']*)\'|"([^"]*)"|\`([^\`]*)\`)', content)
                    if var_match:
                        description = var_match.group(1) or var_match.group(2) or var_match.group(3)
    
    # Determine city
    if '/donostia/' in rel or rel.startswith('donostia'):
        city = 'Donostia'
    elif '/vitoria/' in rel or rel.startswith('vitoria'):
        city = 'Vitoria'
    else:
        city = 'Bilbao'
    
    # Determine type
    if rel in ['index.astro', 'reformas-bilbao.astro']:
        ptype = 'home'
    elif '/blog/' in rel:
        ptype = 'blog'
    elif '/calculadora/' in rel:
        ptype = 'calculadora'
    elif '/empresas/' in rel:
        ptype = 'empresa'
    elif rel in ['contacto.astro']:
        ptype = 'contacto'
    elif rel in ['aviso-legal.astro', 'politica-privacidad.astro']:
        ptype = 'legal'
    elif rel.startswith('presupuesto-'):
        ptype = 'presupuesto'
    elif rel.startswith('barrios/'):
        ptype = 'barrio'
    elif rel == 'calefaccion-bilbao.astro':
        ptype = 'calculadora'
    else:
        ptype = 'other'
    
    title_len = len(title) if title else 0
    desc_len = len(description) if description else 0
    
    results.append({
        'file': rel,
        'title': title,
        'title_len': title_len,
        'description': description,
        'desc_len': desc_len,
        'city': city,
        'type': ptype,
    })

# Print all
print(f"{'FILE':<60} {'TL':>3} {'DL':>4} {'STATUS':<10} TITLE")
print("-" * 170)
for r in results:
    status = ""
    if r['title_len'] == 0 or r['desc_len'] == 0:
        status = "[MISSING]"
    elif r['title_len'] > 60:
        status = "[TTL>60]"
    elif r['desc_len'] > 155:
        status = "[DSC>155]"
    else:
        status = "OK"
    title_display = (r['title'] or '(missing)')[:70]
    print(f"{r['file']:<60} {r['title_len']:>3} {r['desc_len']:>4} {status:<10} {title_display}")

print(f"\nTotal pages: {len(results)}")
missing = [r for r in results if r['title_len'] == 0 or r['desc_len'] == 0]
title_violations = [r for r in results if r['title_len'] > 60]
desc_violations = [r for r in results if r['desc_len'] > 155]
both_ok = [r for r in results if r['title_len'] <= 60 and r['desc_len'] <= 155 and r['title_len'] > 0]
print(f"Pages with missing title or description: {len(missing)}")
print(f"Title violations (>60 chars): {len(title_violations)}")
print(f"Description violations (>155 chars): {len(desc_violations)}")
print(f"OK (within limits): {len(both_ok)}")
if missing:
    print("\n--- MISSING ---")
    for r in missing:
        print(f"  {r['file']}: title={r['title']}, desc={r['description']}")
if title_violations:
    print("\n--- TITLE VIOLATIONS ---")
    for r in title_violations:
        print(f"  {r['file']}: {r['title_len']} — {r['title']}")
if desc_violations:
    print("\n--- DESC VIOLATIONS ---")
    for r in desc_violations:
        print(f"  {r['file']}: {r['desc_len']} — {r['description']}")
