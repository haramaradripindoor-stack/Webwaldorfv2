from PIL import Image
logo = Image.open("/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790013687689.webp").convert("RGB")
# The sun center should be cream
print("Sun center pixel:", logo.getpixel((580, 150)))
