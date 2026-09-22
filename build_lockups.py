from PIL import Image

text_img = Image.open('extracted_text.png')
icon_img = Image.open('extracted_icon.png')

# Get bounding boxes
text_bbox = text_img.getbbox()
icon_bbox = icon_img.getbbox()

text_cropped = text_img.crop(text_bbox)
icon_cropped = icon_img.crop(icon_bbox)

# 1. HORIZONTAL LOCKUP
# Icon on the left, Text on the right. Vertically centered.
gap = 60
out_w = icon_cropped.width + gap + text_cropped.width
out_h = max(icon_cropped.height, text_cropped.height)

horiz = Image.new('RGBA', (out_w, out_h), (0,0,0,0))

# Vertically center them
icon_y = (out_h - icon_cropped.height) // 2
text_y = (out_h - text_cropped.height) // 2

horiz.paste(icon_cropped, (0, icon_y), icon_cropped)
horiz.paste(text_cropped, (icon_cropped.width + gap, text_y), text_cropped)

horiz.save('/Users/felipeandresvivancocornejo/Downloads/Logo_Trekan_Horizontal_Crema.png', format="PNG")

# 2. VERTICAL LOCKUP
# Icon on top, Text centered below
gap_v = 40
out_w_v = max(icon_cropped.width, text_cropped.width)
out_h_v = icon_cropped.height + gap_v + text_cropped.height

vert = Image.new('RGBA', (out_w_v, out_h_v), (0,0,0,0))

icon_x = (out_w_v - icon_cropped.width) // 2
text_x = (out_w_v - text_cropped.width) // 2

vert.paste(icon_cropped, (icon_x, 0), icon_cropped)
vert.paste(text_cropped, (text_x, icon_cropped.height + gap_v), text_cropped)

vert.save('/Users/felipeandresvivancocornejo/Downloads/Logo_Trekan_Vertical_Crema.png', format="PNG")
print("Saved Horizontal and Vertical Lockups!")
