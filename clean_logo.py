from PIL import Image, ImageDraw

logo = Image.open("/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790013687689.webp").convert("RGBA")
draw = ImageDraw.Draw(logo)

# The text "Colegio Waldorf Trekan" is roughly on the right, below the sun, above the hand.
# Let's erase a rectangle that covers the text. We'll make it completely transparent.
# X: from middle (400) to right edge minus some padding (700)
# Y: from below sun (350) to above hand (550)
# We will draw a rectangle with alpha=0
draw.rectangle([390, 370, 700, 560], fill=(0, 0, 0, 0))

# Save the cleaned logo temporarily to check
logo.save("temp_clean.png")

# Now paste it on the sage background
bg_color = (107, 142, 123)  # #6B8E7B
background = Image.new("RGBA", (1080, 1080), bg_color)

max_size = (800, 800)
logo.thumbnail(max_size, Image.Resampling.LANCZOS)
x = (1080 - logo.width) // 2
y = (1080 - logo.height) // 2

background.paste(logo, (x, y), mask=logo)
final_image = background.convert("RGB")
output_path = "/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/Portada_Destacada_Sin_Texto.jpg"
final_image.save(output_path, "JPEG", quality=95)
