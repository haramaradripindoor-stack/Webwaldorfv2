#!/usr/bin/env python3
"""
Script de exportación canónica del Carrusel de Instagram para la Pentatlón Waldorf 2026.
Formato: 10 láminas en relación 4:5 vertical (1080x1350 px) con Máxima Variedad Visual (Escala de planos).
Alterna: Plano General -> Plano Detalle -> Escenario -> Desfile -> Acción -> Disciplina -> Retrato Humano -> Ceremonia -> Banquete -> Cierre Triunfal.
"""

import os
from PIL import Image, ImageEnhance, ImageOps, ImageFilter

OUT_DIR = '/Users/felipeandresvivancocornejo/Downloads/carrusel_pentatlon_2026'
os.makedirs(OUT_DIR, exist_ok=True)

SLIDES = [
    {
        'name': '01_apertura_comitiva.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_080936.jpg',
        'crop_anchor': 0.5,
        'label': 'Plano General: Amanecer con túnicas en el valle'
    },
    {
        'name': '02_detalle_pizarra_arte.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 2/IMG_20261024_072707.jpg',
        'crop_anchor': 0.5,
        'label': 'Plano Detalle: Pizarra Waldorf en tiza (Olimpiadas, Partenón y antorcha)'
    },
    {
        'name': '03_presente_madera_sur.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261023_194324.jpg',
        'crop_anchor': 0.5,
        'label': 'Momento Oficial: Entrega del regalo de madera en el escenario'
    },
    {
        'name': '04_desfile_poleis.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 3/IMG_20261024_090831.jpg',
        'crop_anchor': 0.45,
        'label': 'Desfile: Marcha de las poleis griegas mixtas'
    },
    {
        'name': '05_carreras_pradera.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 3/IMG_20261024_095511.jpg',
        'crop_anchor': 0.5,
        'label': 'Acción Dinámica: Carreras de velocidad sobre el pasto'
    },
    {
        'name': '06_atletismo_jabalina.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_095521.jpg',
        'crop_anchor': 0.5,
        'label': 'Disciplina de Campo: Postura y foco en jabalina'
    },
    {
        'name': '07_retrato_alumnas_lienzo.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 2/IMG-20261024-WA0011.jpg',
        'crop_anchor': 0.5,
        'label': 'Plano Medio Humano: Dos estudiantes sonriendo frente al lienzo oficial'
    },
    {
        'name': '08_coronacion_laurel.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_130309.jpg',
        'crop_anchor': 0.45,
        'label': 'Momento Sagrado: Reverencia al recibir la corona de laurel'
    },
    {
        'name': '09_banquete_comunitario_noche.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 2/IMG_20261023_205117.jpg',
        'crop_anchor': 0.5,
        'label': 'Convivencia: Banquete fraterno en mesas largas'
    },
    {
        'name': '10_celebracion_laurel_diplomas.jpg',
        'src': '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 3/IMG_20261024_131621.jpg',
        'crop_anchor': 0.5,
        'label': 'Cierre Triunfal: Rostros felices con diplomas y laureles'
    }
]

TARGET_W, TARGET_H = 1080, 1350
TARGET_RATIO = TARGET_W / TARGET_H

def export_slides():
    print(f'Exportando carrusel con variedad visual a: {OUT_DIR}')
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
        print(f'✅ {s[\"name\"]:35} -> {s[\"label\"]}')

if __name__ == '__main__':
    export_slides()
