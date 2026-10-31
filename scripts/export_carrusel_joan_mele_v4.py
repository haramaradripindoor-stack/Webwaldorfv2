#!/usr/bin/env python3
"""
Script de exportación canónica del Carrusel Kinfolk V4:
Encuentro Formativo Comunitario con Joan Antoni Melé en Puerto Varas (Noviembre 2026).
Formato: 5 láminas en resolución Retina 2x vertical 4:5 (2160x2700 px).
Integra: Portada crema Kinfolk -> Retrato oficial de Joan Melé frente a pizarra Waldorf ->
Educación y Sentido (niños Trekan) -> Economía Fraterna (Gran Ronda) -> Invitación Formal verde bosque.
"""

import os, shutil
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance

W, H = 2160, 2700
OUT_DIR = '/Users/felipeandresvivancocornejo/Downloads/carrusel_trekan_editorial/kinfolk_v4'
os.makedirs(OUT_DIR, exist_ok=True)

SRC_V3 = '/Users/felipeandresvivancocornejo/Downloads/carrusel_trekan_editorial/kinfolk_v3'

# Typography
FONT_SERIF_ITALIC = ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia Italic.ttf', 92)
FONT_SANS_TRACKING = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 38)
FONT_SANS_BODY = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 48)

GOLD = (205, 170, 110)
WHITE = (255, 255, 255)
LIGHT_GRAY = (220, 220, 220)

def add_veladura_and_text(base_img, label_text, title_text, body_text, footer_text):
    gradient = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw_g = ImageDraw.Draw(gradient)
    
    grad_start = int(H * 0.45)
    for y in range(grad_start, H):
        factor = (y - grad_start) / (H - grad_start)
        alpha = int(245 * (factor ** 1.3))
        draw_g.line([(0, y), (W, y)], fill=(12, 18, 14, min(245, alpha)))
        
    combined = Image.alpha_composite(base_img.convert('RGBA'), gradient)
    draw = ImageDraw.Draw(combined)
    
    y_cursor = int(H * 0.65)
    draw.text((140, y_cursor), label_text.upper(), font=FONT_SANS_TRACKING, fill=GOLD)
    y_cursor += 90
    
    draw.text((140, y_cursor), title_text, font=FONT_SERIF_ITALIC, fill=WHITE)
    y_cursor += 150
    
    words = body_text.split()
    lines, curr_line = [], []
    for word in words:
        curr_line.append(word)
        bbox = draw.textbbox((0, 0), ' '.join(curr_line), font=FONT_SANS_BODY)
        if bbox[2] - bbox[0] > (W - 280):
            curr_line.pop()
            lines.append(' '.join(curr_line))
            curr_line = [word]
    if curr_line:
        lines.append(' '.join(curr_line))
        
    for line in lines:
        draw.text((140, y_cursor), line, font=FONT_SANS_BODY, fill=LIGHT_GRAY)
        y_cursor += 75
        
    draw.line([(140, H - 200), (W - 140, H - 200)], fill=(80, 100, 85, 120), width=2)
    draw.text((140, H - 150), footer_text.upper(), font=FONT_SANS_TRACKING, fill=(160, 175, 165))
    
    return combined.convert('RGB')

def export():
    print(f'Exportando Carrusel Joan Melé Kinfolk V4 a: {OUT_DIR}')
    
    # Slide 1: Portada
    shutil.copy(os.path.join(SRC_V3, 'slide_01_portada_kinfolk.jpg'), os.path.join(OUT_DIR, 'slide_01_portada_kinfolk.jpg'))
    
    # Slide 2: Joan Melé Expositor
    mele_src = Image.open('/tmp/user_uploaded_image.jpg')
    mele_fitted = ImageOps.fit(mele_src, (W, H), centering=(0.5, 0.25))
    slide_02 = add_veladura_and_text(
        mele_fitted,
        'Encuentro Formativo Comunitario · Puerto Varas',
        '«Joan Antoni Melé en el Sur de Chile»',
        'Referente internacional de la Banca Ética y Presidente de la Fundación Dinero y Conciencia. Tres jornadas presenciales para alinear la economía, la crianza y la labor comunitaria con la dignidad humana.',
        'Iniciativa colaborativa de escuelas Waldorf · 27 al 29 de Noviembre'
    )
    slide_02.save(f'{OUT_DIR}/slide_02_joan_mele_expositor.jpg', 'JPEG', quality=95)
    
    # Slide 3: Educación y Sentido
    kids_src = ImageOps.exif_transpose(Image.open('/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4/IMG_20261024_080936.jpg'))
    kids_fitted = ImageEnhance.Color(ImageOps.fit(kids_src, (W, H), centering=(0.5, 0.4))).enhance(1.08)
    slide_03 = add_veladura_and_text(
        kids_fitted,
        'El Propósito de la Infancia',
        '«¿Para qué educamos a nuestros niños?»',
        'No para encajar en un sistema agotado de rendimiento, sino para despertar en ellos la libertad de pensar, la empatía profunda y el coraje de actuar en el mundo.',
        'La educación viva y la economía fraterna se encuentran · Trekan'
    )
    slide_03.save(f'{OUT_DIR}/slide_03_educacion_sentido.jpg', 'JPEG', quality=95)
    
    # Slide 4: Economía Fraterna
    ronda_src = ImageOps.exif_transpose(Image.open('/Users/felipeandresvivancocornejo/Documents/GitHub/Webwaldorfv2/public/imagenes-web/pentatlon-waldorf-trekan-ronda-2026.jpg'))
    ronda_fitted = ImageEnhance.Color(ImageOps.fit(ronda_src, (W, H), centering=(0.5, 0.45))).enhance(1.08)
    slide_04 = add_veladura_and_text(
        ronda_fitted,
        'Trimembración Social & Bien Común',
        '«El dinero no es un fin. Es energía para la vida.»',
        'Cuando la economía se desvincula de las personas, deshumaniza el trabajo y agota la tierra. Joan Melé nos invita a descubrir cómo alinear nuestro quehacer diario con la dignidad humana y el cuidado mutuo.',
        'Espacio abierto para maestros, familias y profesionales · 27 al 29 de Noviembre'
    )
    slide_04.save(f'{OUT_DIR}/slide_04_economia_fraterna.jpg', 'JPEG', quality=95)
    
    # Slide 5: Invitación Formal
    shutil.copy(os.path.join(SRC_V3, 'slide_04_invitacion_formal.jpg'), os.path.join(OUT_DIR, 'slide_05_invitacion_formal.jpg'))
    print('✅ Carrusel Kinfolk V4 exportado con éxito.')

if __name__ == '__main__':
    export()
