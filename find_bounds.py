from PIL import Image
import numpy as np

img_path = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790095861061.webp'
img = Image.open(img_path).convert('RGB')
data = np.array(img)
r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
is_not_white = (r < 250) | (g < 250) | (b < 250)

# Check for gap between tree and text in the Y-range 300 to 550
col_sums = np.sum(is_not_white[300:550, :], axis=0)
gap_cols = np.where(col_sums[350:450] == 0)[0] + 350
print("Gap cols in Y[300:550]:", gap_cols)
