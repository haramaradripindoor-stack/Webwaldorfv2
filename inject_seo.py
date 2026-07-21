import os
import sys
import subprocess
from pathlib import Path

try:
    from PIL import Image, PngImagePlugin
    import piexif
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "piexif"])
    from PIL import Image, PngImagePlugin
    import piexif

def inject_metadata(file_path, title, author, description, keywords):
    try:
        im = Image.open(file_path)
        
        # 1. Preparar Tags de Windows XP para que se vean en "Click Derecho -> Propiedades"
        def to_utf16le(text):
            return text.encode('utf-16le') + b'\x00\x00'

        exif_dict = {
            "0th": {
                piexif.ImageIFD.ImageDescription: description.encode('utf-8'),
                piexif.ImageIFD.Artist: author.encode('utf-8'),
                piexif.ImageIFD.Copyright: author.encode('utf-8'),
                piexif.ImageIFD.Software: "Agencia Utopía AI".encode('utf-8'),
                
                0x9c9b: to_utf16le(title),       # XPTitle
                0x9c9c: to_utf16le(description), # XPComment
                0x9c9d: to_utf16le(author),      # XPAuthor
                0x9c9e: to_utf16le(keywords)     # XPKeywords
            },
            "Exif": {}
        }
        
        exif_bytes = piexif.dump(exif_dict)
        
        # 2. Preparar PngInfo (Estándar nativo para PNGs)
        pnginfo = PngImagePlugin.PngInfo()
        pnginfo.add_text("Title", title)
        pnginfo.add_text("Author", author)
        pnginfo.add_text("Description", description)
        pnginfo.add_text("Copyright", author)
        pnginfo.add_text("Keywords", keywords)
        
        # 3. Guardar sobrescribiendo el archivo original
        format = im.format if im.format else "PNG"
        if file_path.lower().endswith('.jpg') or file_path.lower().endswith('.jpeg'):
             im.save(file_path, "JPEG", exif=exif_bytes)
        elif file_path.lower().endswith('.png'):
             im.save(file_path, "PNG", exif=exif_bytes, pnginfo=pnginfo)
        elif file_path.lower().endswith('.webp'):
             im.save(file_path, "WEBP", exif=exif_bytes)
        else:
             print(f"[SKIP] Formato no soportado para {file_path}: {format}")
             return

        print(f"[OK] Metadata inyectada en: {file_path}")
        
    except Exception as e:
        print(f"[ERROR] procesando {file_path}: {e}")

if __name__ == "__main__":
    title = "Colegio Waldorf Trekan | Puerto Varas"
    author = "Colegio Waldorf Trekan"
    description = "Colegio Waldorf Trekan en Puerto Varas. Educación viva, artística y conectada con la naturaleza para niños (3 a 14 años). Proyecto educativo Waldorf respetuoso."
    keywords = "Colegio Waldorf, Puerto Varas, Educación Alternativa, Parque Ivian, Pedagogía Waldorf, Educación Respetuosa"
    
    images_dir = Path(r"C:\Users\FELIP\Documents\GitHub\Webwaldorfv2\public\images")
    
    for file_path in images_dir.glob("*"):
        if file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
            inject_metadata(str(file_path), title, author, description, keywords)
