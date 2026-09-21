from PIL import Image

# Load the uploaded logo
logo_path = "/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790013687689.webp"
logo = Image.open(logo_path).convert("RGBA")

# Create a Sage Green background (1080x1080) for Instagram Highlights
bg_color = (107, 142, 123)  # #6B8E7B
background = Image.new("RGBA", (1080, 1080), bg_color)

# Resize logo to fit nicely in the center (keeping it quite large so the icon is visible)
# The logo is currently full, we will just scale it down to fit within the 1080x1080 canvas
# with some padding.
max_size = (800, 800)
logo.thumbnail(max_size, Image.Resampling.LANCZOS)

# Calculate position to center the logo
x = (1080 - logo.width) // 2
y = (1080 - logo.height) // 2

# Paste the logo onto the background using the logo's alpha channel as mask
background.paste(logo, (x, y), mask=logo)

# Convert to RGB to save as JPG
final_image = background.convert("RGB")
output_path = "/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/Portada_Destacada_Salvia.jpg"
final_image.save(output_path, "JPEG", quality=95)
print("Portada generada con éxito:", output_path)
