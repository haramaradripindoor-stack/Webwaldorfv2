from PIL import Image, ImageDraw
logo = Image.open("/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790013687689.webp").convert("RGB")
draw = ImageDraw.Draw(logo)

# The background is white (255, 255, 255).
# Let's paint a white rectangle over the text!
draw.rectangle([390, 370, 750, 560], fill=(255, 255, 255))

# Save it
output_path = "/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/Portada_Blanca_Perfecta.jpg"
logo.save(output_path, "JPEG", quality=100)
print("Saved to", output_path)
