"""One-time, lossless WOFF2 conversion. Requires fonttools[woff] and brotli.
Generated files are committed; normal application builds need no Python.
No subsetting, glyph removal, metrics changes or family substitutions.
"""
from pathlib import Path
from fontTools.ttLib import TTFont

for source in sorted(Path('public/fonts').glob('*.ttf')):
    font = TTFont(source, recalcTimestamp=False)
    font.flavor = 'woff2'
    destination = source.with_suffix('.woff2')
    font.save(destination, reorderTables=False)
    restored = TTFont(destination, recalcTimestamp=False)
    for tag in ['cmap', 'hmtx', 'hhea', 'OS/2', 'name']:
        assert font[tag].compile(font) == restored[tag].compile(restored), (source, tag)
    print(f'{source.name}: {source.stat().st_size} -> {destination.stat().st_size} bytes; glyph mapping/metrics/names unchanged')
