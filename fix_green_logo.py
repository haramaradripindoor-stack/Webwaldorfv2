from PIL import Image

img_path = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1788828294829.png'
img = Image.open(img_path).convert('RGB')
width, height = img.size

# We want to erase the text. Let's assume text is between x=450 to 750, y=350 to 600
# We can copy pixels from the far right edge (e.g., x=800) and paste them over the text area.
# Since it's a vertical gradient, the y-coordinate matches perfectly.

pixels = img.load()
for y in range(350, 580):
    for x in range(460, 780):
        # sample from the far right edge at the same y
        pixels[x, y] = pixels[810, y]

# Now let's crop it into a perfect square.
# Tree is centered around x=300 maybe? Let's crop from x=50 to x=800, y=0 to y=750
cropped_img = img.crop((50, 0, 800, 750))

out_path = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/Logo_Verde_Instagram.jpg'
cropped_img.save(out_path, quality=100)
print("Saved to", out_path)
