from PIL import Image, ImageDraw

# Cargar la imagen original
img_path = '/Users/felipeandresvivancoc0rnejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1788810509903.jpg'
try:
    img = Image.open('/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1788810509903.jpg').convert('RGB')
    draw = ImageDraw.Draw(img)
    
    # En el logo de 1024x1024, el texto "Colegio Waldorf Trekan" está aproximadamente
    # en la mitad derecha, debajo del sol. Vamos a pintar un rectángulo blanco sobre el texto.
    # Coordenadas aproximadas (izq, arriba, der, abajo)
    # El sol está arriba a la derecha. El texto está debajo del sol.
    # X: desde la mitad (512) hasta casi el borde derecho (900)
    # Y: desde debajo del sol (400) hasta encima del barco/acuarela (650)
    draw.rectangle([540, 420, 850, 620], fill=(255, 255, 255))
    
    # Ahora recortamos la imagen para que el símbolo (árbol, niño, sol) quede perfectamente centrado
    # para el círculo de Instagram.
    # Vamos a hacer un crop más ajustado.
    # El árbol está un poco a la izquierda, así que al quitar el texto, la imagen queda desbalanceada.
    # Recortaremos un poco del lado derecho y un poco de arriba/abajo para hacer un cuadrado perfecto centrado en el árbol/niño.
    # left, upper, right, lower
    cropped_img = img.crop((100, 50, 924, 874))
    
    # Guardar en Descargas
    import os
    out_path = os.path.expanduser('~/Downloads/Logo_Instagram_Trekan.jpg')
    cropped_img.save(out_path, quality=95)
    print(f"Éxito: {out_path}")
except Exception as e:
    print(f"Error: {e}")
