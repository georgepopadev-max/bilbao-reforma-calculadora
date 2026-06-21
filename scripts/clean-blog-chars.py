#!/usr/bin/env python3
"""
Bilbao Blogs - Character Cleanup
Replaces problematic characters in HTML blog files with ASCII equivalents.
"""
import os
import re
import sys
from pathlib import Path
from collections import Counter
from datetime import datetime

BLOG_DIR = Path("/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/blog")
BACKUP_DIR = Path(f"/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/blog.backup.{datetime.now().strftime('%Y%m%d-%H%M%S')}")

# Replacement rules
REPLACEMENTS = [
    # (original, replacement, description)
    ('–', '-', 'en dash → hyphen'),
    ('—', ' — ', 'em dash → spaced hyphen'),  # Will be cleaned up later
    ('→', '->', 'right arrow → ASCII arrow'),
    ('✓', 'OK', 'check mark → OK'),
    ('✗', 'No', 'cross mark → No'),
    ('×', 'x', 'multiplication sign → x'),
    ('›', '>', 'single right angle quote → >'),
    ('‹', '<', 'single left angle quote → <'),
    ('…', '...', 'ellipsis → three dots'),
    ('“', '"', 'left double smart quote → "'),
    ('”', '"', 'right double smart quote → "'),
    ('‘', "'", 'left single smart quote → \''),
    ('’', "'", 'right single smart quote → \''),
    ('«', '"', 'left guillemet → "'),
    ('»', '"', 'right guillemet → "'),
    ('‑', '-', 'non-breaking hyphen → hyphen'),
    ('　', ' ', 'ideographic space → space'),
]

# Second-pass cleanups (run after main replacements)
def post_cleanup(text):
    # Clean up spaces around the em-dash replacement
    # Pattern: "word — word" → "word - word" (remove extra spaces around em dash)
    text = text.replace('  —  ', ' — ')  # multiple spaces around em dash
    text = text.replace(' - ', ' - ')  # normalize spaces around hyphen
    
    # Common Spanish patterns that should NOT have spaces around em dash
    # E.g., "piso — reforma" should become "piso - reforma"
    text = re.sub(r' — ', ' - ', text)
    text = re.sub(r' —', ' - ', text)
    text = re.sub(r'— ', ' - ', text)
    
    # Multiple spaces → single space (but preserve indentation)
    # Be careful with pre-formatted text and code blocks
    # Apply only to non-preformatted regions
    text = re.sub(r'(?<!^)  +', ' ', text, flags=re.MULTILINE)
    
    return text


def get_blog_files():
    """Get all blog HTML files, excluding BRIEF and .new files."""
    files = []
    for f in BLOG_DIR.iterdir():
        if not f.is_file():
            continue
        if f.name.startswith('BRIEF'):
            continue
        if f.name.endswith('.new'):
            continue
        if f.name == 'blog-styles.css':
            continue
        if f.suffix == '.html':
            files.append(f)
    return sorted(files)


def clean_file(filepath, replacement_counts):
    """Clean problematic characters in a single HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()
    
    cleaned = original
    for old, new, desc in REPLACEMENTS:
        count = cleaned.count(old)
        if count > 0:
            cleaned = cleaned.replace(old, new)
            replacement_counts[(old, new, desc)] += count
    
    # Post-cleanup
    cleaned = post_cleanup(cleaned)
    
    if cleaned != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        return True
    return False


def validate_html(filepath):
    """Basic HTML validation - check tags match."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count opening and closing tags for major tags
    issues = []
    for tag in ['html', 'head', 'body', 'main', 'article', 'section']:
        opens = len(re.findall(rf'<{tag}[\s>]', content))
        closes = len(re.findall(rf'</{tag}>', content))
        if opens != closes:
            issues.append(f'{tag}: {opens} open, {closes} close')
    
    # Check for orphan characters
    orphan = []
    if content.count('<') != content.count('>'):
        issues.append(f'Unbalanced angle brackets: <{content.count("<")} >{content.count(">")}')
    
    return issues


def main():
    print('=' * 60)
    print('Bilbao Blogs - Character Cleanup')
    print('=' * 60)
    
    # Step 1: Get files
    files = get_blog_files()
    print(f'\n[1/4] Found {len(files)} blog HTML files to process')
    
    # Step 2: Create backup
    print(f'\n[2/4] Creating backup at: {BACKUP_DIR.name}')
    import shutil
    shutil.copytree(BLOG_DIR, BACKUP_DIR)
    print(f'      Backup created ({sum(1 for _ in BACKUP_DIR.iterdir())} items)')
    
    # Step 3: Apply replacements
    print(f'\n[3/4] Applying replacements...')
    replacement_counts = Counter()
    files_changed = 0
    for filepath in files:
        if clean_file(filepath, replacement_counts):
            files_changed += 1
    
    print(f'      Files changed: {files_changed}/{len(files)}')
    print(f'      Total replacements: {sum(replacement_counts.values())}')
    print(f'\n      Breakdown by character:')
    for (old, new, desc), count in sorted(replacement_counts.items(), key=lambda x: -x[1]):
        if count > 0:
            print(f'        {repr(old):8s} → {repr(new):8s} ({desc}): {count}')
    
    # Step 4: Validate
    print(f'\n[4/4] Validating HTML...')
    all_issues = []
    for filepath in files:
        issues = validate_html(filepath)
        if issues:
            all_issues.append((filepath.name, issues))
    
    if all_issues:
        print(f'      ⚠️  Found issues in {len(all_issues)} files:')
        for fname, issues in all_issues[:5]:
            print(f'        {fname}: {issues}')
    else:
        print(f'      ✅ All {len(files)} files valid')
    
    # Final check: count remaining problem chars
    print(f'\n[FINAL] Verifying cleanup...')
    remaining = Counter()
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        for old, _, _ in REPLACEMENTS:
            n = content.count(old)
            if n > 0:
                remaining[old] += n
    
    if remaining:
        print(f'      Remaining problem chars:')
        for c, n in remaining.most_common():
            print(f'        {repr(c)}: {n}')
    else:
        print(f'      ✅ No remaining problem characters')
    
    print(f'\n{"=" * 60}')
    print(f'DONE')
    print(f'  Files processed: {len(files)}')
    print(f'  Files changed: {files_changed}')
    print(f'  Total replacements: {sum(replacement_counts.values())}')
    print(f'  Backup: {BACKUP_DIR.name}')
    print(f'{"=" * 60}')
    
    return 0 if not all_issues else 1


if __name__ == '__main__':
    sys.exit(main())