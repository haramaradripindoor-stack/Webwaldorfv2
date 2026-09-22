from PIL import Image
import numpy as np

def apply_light_logo_back(hoodie_path, logo_path, out_path, pos_x, pos_y, scale=0.40):
    hoodie = Image.open(hoodie_path).convert('RGB')
    logo = Image.open(logo_path).convert('RGB')
    data = np.array(logo)
    
    # Mask white bg
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    is_not_white = (r < 250) | (g < 250) | (b < 250)
    
    rgba_data = np.zeros((data.shape[0], data.shape[1], 4), dtype=np.uint8)
    rgba_data[:,:,:3] = data
    rgba_data[:,:,3] = is_not_white * 255
    
    transparent_logo = Image.fromarray(rgba_data, 'RGBA')
    
    # Scale
    new_w = int(hoodie.width * scale)
    aspect = transparent_logo.height / transparent_logo.width
    new_h = int(new_w * aspect)
    transparent_logo = transparent_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Center paste
    center_x = (hoodie.width - new_w) // 2
    hoodie.paste(transparent_logo, (center_x, pos_y), transparent_logo)
    
    hoodie.save(out_path, quality=95)
    print(f"Saved {out_path}")

base_dir = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/'
moss_in = base_dir + 'hoodie_moss_back_1790096898725.jpg'
logo_in = base_dir + '.user_uploaded/media_1790096257676.webp' # cream logo

out_moss = base_dir + 'moss_back_con_logo.jpg'

apply_light_logo_back(moss_in, logo_in, out_moss, 0, 350, scale=0.45)
