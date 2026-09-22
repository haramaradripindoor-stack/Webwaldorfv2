from PIL import Image, ImageChops

def apply_logo(hoodie_path, logo_path, out_path, pos_x, pos_y, scale=0.10):
    # Open images
    hoodie = Image.open(hoodie_path).convert('RGB')
    logo = Image.open(logo_path).convert('RGB')
    
    # Calculate new logo size
    new_w = int(hoodie.width * scale)
    aspect = logo.height / logo.width
    new_h = int(new_w * aspect)
    logo = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create a white canvas the size of the hoodie
    canvas = Image.new('RGB', hoodie.size, (255, 255, 255))
    
    # Paste the logo onto the canvas
    canvas.paste(logo, (pos_x, pos_y))
    
    # Multiply
    result = ImageChops.multiply(hoodie, canvas)
    
    result.save(out_path, quality=95)
    print(f"Saved {out_path}")

base_dir = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/'
avena_in = base_dir + 'hoodie_avena_blank_1790095706498.jpg'
gris_in = base_dir + 'hoodie_gris_blank_1790095717822.jpg'
logo_in = base_dir + '.user_uploaded/media_1790095601240.jpg' # full color logo

out_avena = base_dir + 'avena_con_trekan.jpg'
out_gris = base_dir + 'gris_con_trekan.jpg'

# 1024x1024 hoodies. Chest is usually around x=630, y=380
apply_logo(avena_in, logo_in, out_avena, 630, 420, scale=0.12)
apply_logo(gris_in, logo_in, out_gris, 630, 380, scale=0.12)

