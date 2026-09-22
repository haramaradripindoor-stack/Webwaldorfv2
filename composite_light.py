from PIL import Image, ImageChops, ImageOps
import numpy as np

def apply_light_logo(hoodie_path, logo_path, out_path, pos_x, pos_y, scale=0.10):
    hoodie = Image.open(hoodie_path).convert('RGB')
    
    # Open the user's logo (RGB with white background)
    logo = Image.open(logo_path).convert('RGB')
    
    # Convert to numpy
    data = np.array(logo)
    
    # Mask out the white background
    # The logo is cream. Background is white (255,255,255).
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    
    # Is not white
    is_not_white = (r < 250) | (g < 250) | (b < 250)
    
    # Create an RGBA image where white is transparent
    rgba_data = np.zeros((data.shape[0], data.shape[1], 4), dtype=np.uint8)
    rgba_data[:,:,:3] = data
    rgba_data[:,:,3] = is_not_white * 255
    
    transparent_logo = Image.fromarray(rgba_data, 'RGBA')
    
    # Calculate new logo size
    new_w = int(hoodie.width * scale)
    aspect = transparent_logo.height / transparent_logo.width
    new_h = int(new_w * aspect)
    transparent_logo = transparent_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste onto hoodie
    hoodie.paste(transparent_logo, (pos_x, pos_y), transparent_logo)
    
    hoodie.save(out_path, quality=95)
    print(f"Saved {out_path}")

base_dir = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/'
olive_in = base_dir + 'hoodie_olive_blank_1790096590202.jpg'
moss_in = base_dir + 'hoodie_moss_blank_1790096618538.jpg'
logo_in = base_dir + '.user_uploaded/media_1790096257676.webp' # cream logo with white bg

out_olive = base_dir + 'olive_con_logo.jpg'
out_moss = base_dir + 'moss_con_logo.jpg'

# 1024x1024 hoodies. Chest is usually around x=630, y=400
apply_light_logo(olive_in, logo_in, out_olive, 650, 390, scale=0.15)
# The moss hoodie is a zip-up. The left chest is slightly shifted.
apply_light_logo(moss_in, logo_in, out_moss, 650, 420, scale=0.13)
