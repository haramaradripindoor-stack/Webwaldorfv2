from PIL import Image, ImageChops, ImageOps
import numpy as np

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip('#')
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

def apply_premium_logo(hoodie_path, logo_path, out_path, pos_x, pos_y, scale=0.10):
    hoodie = Image.open(hoodie_path).convert('RGB')
    
    # Open the user's logo. It might be RGBA or RGB (with white background).
    logo = Image.open(logo_path).convert('RGBA')
    
    # We want to change the cream color (or any non-white color) to Sage Green (#6B8E7B).
    # Since the image might just have a white background, let's convert it to a mask.
    # We'll convert to grayscale. The logo is cream (light) and background is white. 
    # Actually, if the background is transparent, we can just use the alpha.
    
    # Let's inspect the logo in numpy
    data = np.array(logo)
    
    # If it's a solid white background, data[:,:,:3] will be 255,255,255.
    # Let's create a mask where it is NOT white/transparent.
    # To be safe, if alpha exists and is 0, it's transparent.
    # If RGB is close to white (e.g. > 240,240,240), it's background.
    
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Mask of the logo pixels (not white and not fully transparent)
    is_not_white = (r < 250) | (g < 250) | (b < 250)
    is_opaque = a > 10
    logo_mask = is_not_white & is_opaque
    
    # Now, we want to color these logo pixels with Sage Green (107, 142, 123)
    sage_color = (107, 142, 123, 255)
    
    # Create a new RGBA image for the sage logo
    sage_logo_data = np.zeros_like(data)
    sage_logo_data[logo_mask] = sage_color
    # Make background transparent
    sage_logo_data[~logo_mask] = (255, 255, 255, 0)
    
    sage_logo = Image.fromarray(sage_logo_data, 'RGBA')
    
    # Calculate new logo size
    new_w = int(hoodie.width * scale)
    aspect = sage_logo.height / sage_logo.width
    new_h = int(new_w * aspect)
    sage_logo = sage_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste the sage logo onto the hoodie using its own alpha as the mask
    hoodie.paste(sage_logo, (pos_x, pos_y), sage_logo)
    
    hoodie.save(out_path, quality=95)
    print(f"Saved {out_path}")

base_dir = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/'
avena_in = base_dir + 'hoodie_avena_blank_1790095706498.jpg'
gris_in = base_dir + 'hoodie_gris_blank_1790095717822.jpg'
logo_in = base_dir + '.user_uploaded/media_1790095861061.webp' # cream logo

out_avena = base_dir + 'avena_con_trekan_premium.jpg'
out_gris = base_dir + 'gris_con_trekan_premium.jpg'

apply_premium_logo(avena_in, logo_in, out_avena, 630, 420, scale=0.12)
apply_premium_logo(gris_in, logo_in, out_gris, 630, 380, scale=0.12)
