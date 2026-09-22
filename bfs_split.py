from PIL import Image
import numpy as np

img_path = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790095861061.webp'
img = Image.open(img_path).convert('RGB')
data = np.array(img)
r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
is_not_white = (r < 250) | (g < 250) | (b < 250)

h, w = is_not_white.shape
visited = np.zeros_like(is_not_white, dtype=bool)

text_mask = np.zeros_like(is_not_white, dtype=bool)

def bfs(start_y, start_x):
    q = [(start_y, start_x)]
    visited[start_y, start_x] = True
    component = []
    
    while q:
        cy, cx = q.pop(0)
        component.append((cy, cx))
        
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1), (-1,-1), (-1,1), (1,-1), (1,1)]:
            ny, nx = cy+dy, cx+dx
            if 0 <= ny < h and 0 <= nx < w:
                if is_not_white[ny, nx] and not visited[ny, nx]:
                    visited[ny, nx] = True
                    q.append((ny, nx))
    return component

components = []
for y in range(300, 650):
    for x in range(440, w):
        if is_not_white[y, x] and not visited[y, x]:
            comp = bfs(y, x)
            # Check if component is strictly within the text bounds
            ys = [p[0] for p in comp]
            xs = [p[1] for p in comp]
            if min(xs) > 420 and max(ys) < 660 and min(ys) > 280:
                for py, px in comp:
                    text_mask[py, px] = True

print("Text mask extracted pixels:", np.sum(text_mask))

# Save the isolated text and icon
rgba_text = np.zeros((h, w, 4), dtype=np.uint8)
rgba_text[text_mask, 0] = 245; rgba_text[text_mask, 1] = 238; rgba_text[text_mask, 2] = 224; rgba_text[text_mask, 3] = 255
Image.fromarray(rgba_text, 'RGBA').save('extracted_text.png')

icon_mask = is_not_white & (~text_mask)
rgba_icon = np.zeros((h, w, 4), dtype=np.uint8)
rgba_icon[icon_mask, 0] = 245; rgba_icon[icon_mask, 1] = 238; rgba_icon[icon_mask, 2] = 224; rgba_icon[icon_mask, 3] = 255
Image.fromarray(rgba_icon, 'RGBA').save('extracted_icon.png')
print("Done.")
