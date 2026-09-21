from PIL import Image, ImageDraw
import numpy as np

logo = Image.open("/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790019813365.webp").convert("RGB")

# First, paint the white rectangle over the text so it's gone
draw = ImageDraw.Draw(logo)
draw.rectangle([390, 370, 750, 560], fill=(255, 255, 255))

arr = np.array(logo, dtype=np.float32)

R = arr[:,:,0]
G = arr[:,:,1]
B = arr[:,:,2]

# t = (255 - R) / (255 - 237)
t = (255.0 - R) / (255.0 - 237.0)
t = np.clip(t, 0.0, 1.0)

# Sage: 107, 142, 123
# Cream: 237, 227, 203
new_R = 107.0 * (1.0 - t) + 237.0 * t
new_G = 142.0 * (1.0 - t) + 227.0 * t
new_B = 123.0 * (1.0 - t) + 203.0 * t

new_arr = np.zeros_like(arr)
new_arr[:,:,0] = new_R
new_arr[:,:,1] = new_G
new_arr[:,:,2] = new_B

final_img = Image.fromarray(new_arr.astype(np.uint8))

# Now paste onto 1080x1080 canvas
canvas = Image.new("RGB", (1080, 1080), (107, 142, 123))
max_size = (800, 800)
final_img.thumbnail(max_size, Image.Resampling.LANCZOS)
x = (1080 - final_img.width) // 2
y = (1080 - final_img.height) // 2
canvas.paste(final_img, (x, y))

output_path = "/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/Portada_Salvia_Perfecta.jpg"
canvas.save(output_path, "JPEG", quality=100)
print("Saved to", output_path)
