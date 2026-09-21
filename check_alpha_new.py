from PIL import Image
logo = Image.open("/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790019813365.webp").convert("RGBA")
print("Top-left pixel:", logo.getpixel((0,0)))
