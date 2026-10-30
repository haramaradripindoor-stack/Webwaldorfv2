#!/usr/bin/env python3
"""
Script de exportación canónica del Carrusel de Instagram para la Pentatlón Waldorf 2026.
Formato: 10 láminas en relación 4:5 vertical (1080x1350 px) a partir de archivos RAW de cámara (4000x1800 px).
Acabado editorial Waldorf (Kinfolk): sutil realce cálido, contraste natural y Unsharp Mask óptico.
"""

import os
from PIL import Image, ImageEnhance, ImageOps, ImageFilter

OUT_DIR = '/Users/felipeandresvivancocornejo/Downloads/carrusel_pentatlon_2026'
os.makedirs(OUT_DIR, exist_ok=True)

SLIDES = [
    {
        'name': '01_apertura_comitiva.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_080936.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '02_gran_ronda_fraternidad.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_080950.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '03_presente_madera_sur.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261023_194324.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '04_desfile_poleis.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 3/IMG_20261024_090831.jpg',
        'crop_anchor': 0.45
    },
    {
        'name': '05_carreras_pradera.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 3/IMG_20261024_095511.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '06_atletismo_jabalina.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_095521.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '07_disciplina_esfuerzo_noble.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_095847.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '08_coronacion_laurel.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_130309.jpg',
        'crop_anchor': 0.45
    },
    {
        'name': '09_comunidad_jardin.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 3/IMG_20261024_132613.jpg',
        'crop_anchor': 0.5
    },
    {
        'name': '10_celebracion_laurel_diplomas.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 3/IMG_20261024_131621.jpg',
        'crop_anchor': 0.5
    }
]

TARGET_W, TARGET_H = 1080, 1350
TARGET_RATIO = TARGET_W / TARGET_H

def export_slides():
    print(f'Exportando carrusel canónico en alta definición a: {OUT_DIR}')
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
        
        # Acabado editorial Waldorf / Kinfolk
        final_img = ImageEnhance.Color(final_img).enhance(1.06)
        final_img = ImageEnhance.Contrast(final_img).enhance(1.04)
        final_img = ImageEnhance.Brightness(final_img).enhance(1.02)
        final_img = final_img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=130, threshold=2))
        
        out_path = os.path.join(OUT_DIR, s['name'])
        final_img.save(out_path, 'JPEG', quality=96, optimize=True)
        print(f'✅ {s[\"name\"]:35} -> Guardada ({TARGET_W}x{TARGET_H}) -> {os.path.getsize(out_path)//1024} KB')

if __name__ == '__main__':
    export_slides()
