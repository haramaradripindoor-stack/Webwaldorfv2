from PIL import Image
import numpy as np

# Load logo
logo = Image.open("/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790013687689.webp").convert("RGBA")
arr = np.array(logo)

# The logo might be cream on white, or cream on transparent.
# Let's find the cream color. The background is likely pure white (255,255,255) or transparent (alpha=0).
# Let's just keep the non-white, non-transparent pixels.
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

# Create a mask of the logo (where it is NOT white and NOT transparent)
# Assuming white is > 240 for R, G, B
is_not_white = (r < 250) | (g < 250) | (b < 250)
is_not_transparent = (a > 10)
logo_mask = is_not_white & is_not_transparent

# Now erase the text area. The text is roughly X: 390 to 750, Y: 370 to 560
# Let's just set the mask to False in that region
# arr shape is (height, width, 4)
# Y is axis 0, X is axis 1
logo_mask[400:580, 390:750] = False

# Now let's create the final image
# Background is Sage: #6B8E7B (107, 142, 123)
# Cream color from the logo: let's pick a representative cream color (e.g., #E8DECC or similar)
# We can just extract the cream pixels from the original image where mask is True!

final_arr = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
# Fill with sage
final_arr[:,:] = [107, 142, 123, 255]

# Where mask is true, put the original logo pixels
final_arr[logo_mask] = arr[logo_mask]

final_img = Image.fromarray(final_arr)

# Now paste it centered on a 1080x1080 sage canvas
canvas = Image.new("RGBA", (1080, 1080), (107, 142, 123, 255))
max_size = (800, 800)
final_img.thumbnail(max_size, Image.Resampling.LANCZOS)

x = (1080 - final_img.width) // 2
y = (1080 - final_img.height) // 2

# We paste final_img. But wait, final_img is a sage square!
# It's better to make final_img transparent background, and paste on canvas
# Let's recreate final_img with transparent background

final_arr_trans = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
final_arr_trans[logo_mask] = arr[logo_mask]
final_img_trans = Image.fromarray(final_arr_trans)
final_img_trans.thumbnail(max_size, Image.Resampling.LANCZOS)

canvas.paste(final_img_trans, (x, y), mask=final_img_trans)

# Save
output_path = "/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/Portada_Destacada_Fija.jpg"
canvas.convert("RGB").save(output_path, "JPEG", quality=95)
print("Saved to", output_path)
