from PIL import Image
import numpy as np
import os

base_dir = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/'
downloads_dir = '/Users/felipeandresvivancocornejo/Downloads/'

def make_transparent_cream_from_webp(in_path, out_path):
    img = Image.open(in_path).convert('RGB')
    data = np.array(img)
    
    # Background is white. Logo is cream.
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    is_not_white = (r < 250) | (g < 250) | (b < 250)
    
    rgba = np.zeros((data.shape[0], data.shape[1], 4), dtype=np.uint8)
    # Use exact cream color: 245, 238, 224
    rgba[:,:,0] = 245
    rgba[:,:,1] = 238
    rgba[:,:,2] = 224
    rgba[:,:,3] = is_not_white * 255
    
    out_img = Image.fromarray(rgba, 'RGBA')
    out_img.save(out_path, format="PNG")
    print("Saved:", out_path)

def make_transparent_cream_from_png(in_path, out_path):
    img = Image.open(in_path).convert('RGBA')
    data = np.array(img)
    
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    is_opaque = a > 0
    
    data[is_opaque, 0] = 245
    data[is_opaque, 1] = 238
    data[is_opaque, 2] = 224
    
    out_img = Image.fromarray(data, 'RGBA')
    out_img.save(out_path, format="PNG")
    print("Saved:", out_path)

logo_webp = base_dir + '.user_uploaded/media_1790096257676.webp' # Logo normal
logo_circular = base_dir + '.user_uploaded/media_1790096257657.png' # Logo circular

make_transparent_cream_from_webp(logo_webp, downloads_dir + 'Logo_Trekan_Crema_Transparente.png')
make_transparent_cream_from_png(logo_circular, downloads_dir + 'Logo_Trekan_Circular_Crema_Transparente.png')

