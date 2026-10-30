#!/usr/bin/env python3
"""
Script de exportación canónica del Carrusel de Instagram para la Pentatlón Waldorf 2026.
Formato: 10 láminas en relación 4:5 vertical (1080x1350 px) optimizadas a 95% calidad.
"""

import os
from PIL import Image, ImageEnhance, ImageOps

OUT_DIR = '/Users/felipeandresvivancocornejo/Downloads/carrusel_pentatlon_2026'
os.makedirs(OUT_DIR, exist_ok=True)

SLIDES = [
    {
        'name': '01_apertura_comitiva.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026/IMG_20261024_080936.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '02_gran_ronda_fraternidad.jpg',
        'src': '/Users/felipeandresvivancocornejo/Documents/GitHub/Webwaldorfv2/public/imagenes-web/pentatlon-waldorf-trekan-ronda-2026.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '03_presente_madera_sur.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 2/IMG_20261023_194324.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '04_desfile_poleis.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026/IMG_20261024_090831.jpg',
        'crop_anchor': 0.45
    },
    {
        'name': '05_carreras_pradera.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026/IMG_20261024_095511.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '06_atletismo_jabalina.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026/IMG_20261024_095521.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '07_lucha_noble_pancracio.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026/IMG_20261024_114822.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '08_coronacion_laurel.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 2/IMG_20261024_130309.jpg',
        'crop_anchor': 0.45
    },
    {
        'name': '09_banquete_comunitario.jpg',
        'src': '/Users/felipeandresvivancocornejo/Documents/GitHub/Webwaldorfv2/public/imagenes-web/pentatlon-waldorf-banquete-comunitario.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '10_cierre_trekan_laurel.jpg',
        'src': '/Users/felipeandresvivancocornejo/Documents/GitHub/Webwaldorfv2/public/imagenes-web/pentatlon-waldorf-buen-provecho-laurel.jpg',
        'crop_anchor': 0.5
    }
]

TARGET_W, TARGET_H = 1080, 1350
TARGET_RATIO = TARGET_W / TARGET_H

def export_slides():
    print(f'Exportando carrusel canónico a: {OUT_DIR}')
    for s in SLIDES:
        src = s['src']
        if not os.path.exists(src):
            print(f'⚠️ Archivo origen no encontrado: {src}')
            continue
        
        img = Image.open(src)
        img = ImageOps.exif_transpose(img)
        w, h = img.size
        ratio = w / h
        
        if ratio > TARGET_RATIO:
            new_w = int(h * TARGET_RATIO)
            offset = int((w - new_w) * s['crop_anchor'])
            img_cropped = img.crop((offset, 0, offset + new_w, h))
        else:
            new_h = int(w / TARGET_RATIO)
            offset = int((h - new_h) * s['crop_anchor'])
            img_cropped = img.crop((0, offset, w, offset + new_h))
            
        final_img = img_cropped.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
        
        # Sutil realce fotográfico cálido Waldorf
        final_img = ImageEnhance.Color(final_img).enhance(1.05)
        final_img = ImageEnhance.Contrast(final_img).enhance(1.03)
        
        out_path = os.path.join(OUT_DIR, s['name'])
        final_img.save(out_path, 'JPEG', quality=95, optimize=True)
        print(f'✅ {s[\"name\"]} guardada ({TARGET_W}x{TARGET_H}) -> {os.path.getsize(out_path)//1024} KB')

if __name__ == '__main__':
    export_slides()
