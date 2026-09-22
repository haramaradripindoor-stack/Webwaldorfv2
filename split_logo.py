from PIL import Image
import numpy as np
import sys

img_path = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790095861061.webp'

img = Image.open(img_path).convert('RGB')
data = np.array(img)

# Make background transparent
r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
is_not_white = (r < 250) | (g < 250) | (b < 250)

rgba = np.zeros((data.shape[0], data.shape[1], 4), dtype=np.uint8)
rgba[:,:,0] = 245
rgba[:,:,1] = 238
rgba[:,:,2] = 224
rgba[:,:,3] = is_not_white * 255

transparent_img = Image.fromarray(rgba, 'RGBA')

# Text is roughly in the right-middle area. Let's slice it out.
# Width = 757, Height = 807
# Let's crop: left=410, top=330, right=757, bottom=550 (approximate)
text_box = (420, 360, 757, 520)
text_img = transparent_img.crop(text_box)
text_img.save('text_test.png')

# Create the icon by erasing the text area from the full image
icon_data = np.copy(rgba)
# set alpha to 0 in text bounding box
icon_data[360:520, 420:757, 3] = 0
icon_img = Image.fromarray(icon_data, 'RGBA')
icon_img.save('icon_test.png')

print("Saved test images.")
