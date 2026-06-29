#!/usr/bin/env python3
import re, os, html

subcarpetas = [
    ("subvencion-accesibilidad-donostia", "Subvencion Accesibilidad Donostia 2026 | Ayudas Adaptacion"),
    ("subvencion-cambio-calderas-vitoria", "Subvencion Cambio Calderas Vitoria 2026: Ayudas hasta 3.000 EUR"),
    ("subvencion-cambio-ventanas-bilbao", "Subvencion Ventanas Bilbao 2026 | Ayudas Eficiencia por m2"),
    ("subvencion-eficiencia-energetica-bilbao", "Eficiencia Energetica Bilbao 2026: Subvencion Hasta 12.750 EUR"),
    ("subvencion-fachadas-bilbao", "Subvencion Fachadas Bilbao 2026: Ayudas, ITE y Eficiencia"),
    ("subvencion-rehabilitacion-energetica-donostia", "Rehab Energetica Donostia 2026: Subvencion Hasta 10.000 EUR"),
]

TEMPLATE = """---
/**
 * {slug} — static Astro page migrated from legacy HTML
 * A2 Zone
 */
import BaseLayout from '{depth}layouts/BaseLayout.astro';

const title = '{title_esc}';
const description = '{desc_esc}';
const canonical = '{canonical}';
const date = '{meta_esc}';
---

<BaseLayout title={{title}} description={{description}} canonical={{canonical}}>
  <main style="max-width:860px;margin:0 auto;padding:2rem 1rem">
    <nav style="display:flex;gap:.5rem;font-size:.8125rem;color:#6B6B6B;margin-bottom:1.5rem;flex-wrap:wrap">
      <a href="/index.html" style="color:#C45C3E;text-decoration:none">Inicio</a>
      <span>›</span>
      <a href="/blog/index.html" style="color:#C45C3E;text-decoration:none">Blog</a>
      <span>›</span>
      <a href="/blog/subvenciones-reformas/" style="color:#C45C3E;text-decoration:none">Subvenciones</a>
      <span>›</span>
      <span>{breadcrumb_city}</span>
    </nav>

    <header style="margin-bottom:2rem">
      <p style="font-size:.8125rem;color:#6B6B6B;margin-bottom:1rem;font-family:'DM Mono',monospace">{{date}}</p>
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:2rem;font-weight:700;color:#2D2D2D;line-height:1.25;margin-bottom:1rem">
        {h1_esc}
      </h1>
      {lead ? <p style="font-size:1.0625rem;color:#6B6B6B;line-height:1.65">{lead_esc}</p> : null}
    </header>

    <article style="background:#FFFFFF;border-radius:12px;padding:2rem;box-shadow:0 2px 8px rgba(45,30,15,.08)">
      {content_esc}
      {table_esc}
    </article>
  </main>
</BaseLayout>
"""

for slug, fallback_title in subcarpetas:
    path = "blog/{}/index.html".format(slug)
    with open(path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Extract title
    title_match = re.search(r'<title>(.*?)</title>', html_content)
    title = title_match.group(1).strip() if title_match else fallback_title

    # Extract description
    desc_match = re.search(r'<meta name="description" content="(.*?)"', html_content)
    description = desc_match.group(1).strip() if desc_match else ""

    # Extract canonical
    canon_match = re.search(r'<link rel="canonical" href="(.*?)"', html_content)
    canonical = canon_match.group(1).strip() if canon_match else ""

    # Extract meta date
    meta_match = re.search(r'<p class="meta">(.*?)</p>', html_content)
    meta_text = meta_match.group(1).strip() if meta_match else ""

    # Extract article body
    body_match = re.search(r'<article class="body">(.*?)</article>', html_content, re.DOTALL)
    body = body_match.group(1).strip() if body_match else ""

    # Clean the body: remove FAQ divs, CTA, rel-grid, src
    content = re.sub(r'<div class="faq">.*?</div>', '', body, flags=re.DOTALL)
    content = re.sub(r'<div class="cta">.*?</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div class="rel-grid">.*?</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div class="src">.*?</div>', '', content, flags=re.DOTALL)

    # Extract h1 text from art-h
    h1_match = re.search(r'<h1>(.*?)</h1>', body)
    h1_text = re.sub(r'<[^>]+>', '', h1_match.group(1)).strip() if h1_match else title.split(" - ")[0]

    # Extract lead
    lead_match = re.search(r'<p class="lead">(.*?)</p>', body)
    lead_raw = lead_match.group(1).strip() if lead_match else ""
    lead = re.sub(r'<[^>]+>', '', lead_raw).strip()

    # Detect city from slug
    city = "donostia" if "donostia" in slug else "vitoria" if "vitoria" in slug else "bilbao"
    breadcrumb_city = "Donostia" if city == "donostia" else "Vitoria" if city == "vitoria" else "Bilbao"

    # Depth from src/pages/blog/[subcarpeta]/
    depth = "../../../../"

    # Table HTML
    tables = re.findall(r'<div style="overflow-x:auto"><table class="t">.*?</table></div>', content, re.DOTALL)
    table_html = tables[0] if tables else ''

    out_dir = "src/pages/blog/{}".format(slug)
    os.makedirs(out_dir, exist_ok=True)
    out_path = "{}/index.astro".format(out_dir)

    # Escape single quotes for JS string
    title_esc = title.replace("'", "\\'")
    desc_esc = description.replace("'", "\\'")
    meta_esc = meta_text.replace("'", "\\'")
    h1_esc = h1_text.replace("'", "\\'")
    lead_esc = lead.replace("'", "\\'")
    content_esc = content.replace("'", "\\'")
    table_esc = table_html.replace("'", "\\'")

    output = TEMPLATE.format(
        slug=slug,
        depth=depth,
        title_esc=title_esc,
        desc_esc=desc_esc,
        canonical=canonical,
        meta_esc=meta_esc,
        breadcrumb_city=breadcrumb_city,
        h1_esc=h1_esc,
        lead_esc=lead_esc,
        content_esc=content_esc,
        table_esc=table_esc,
    )

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(output)
    print("Created: {}".format(out_path))
