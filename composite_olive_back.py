from PIL import Image
import numpy as np

base_dir = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/'
olive_in = base_dir + 'hoodie_olive_back_real_1790099241561.jpg'
logo_in = base_dir + '.user_uploaded/media_1790096257657.png' # circular logo (RGBA)

out_olive = base_dir + 'olive_back_con_logo.jpg'

hoodie = Image.open(olive_in).convert('RGB')
logo = Image.open(logo_in).convert('RGBA')

data = np.array(logo)
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Change green to Cream (239, 231, 211)
is_opaque = a > 0
data[is_opaque, 0] = 239  # R
data[is_opaque, 1] = 231  # G
data[is_opaque, 2] = 211  # B

cream_logo = Image.fromarray(data, 'RGBA')

scale = 0.38
new_w = int(hoodie.width * scale)
aspect = cream_logo.height / cream_logo.width
new_h = int(new_w * aspect)

cream_logo = cream_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)

center_x = (hoodie.width - new_w) // 2
pos_y = 300 # Lower it slightly below the hood

# Paste using alpha mask
hoodie.paste(cream_logo, (center_x, pos_y), cream_logo)

hoodie.save(out_olive, quality=95)
print("Saved olive back.")
