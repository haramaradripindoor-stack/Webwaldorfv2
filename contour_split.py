from PIL import Image
import numpy as np

img_path = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/.user_uploaded/media_1790095861061.webp'
img = Image.open(img_path).convert('RGB')
data = np.array(img)
r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
is_not_white = (r < 250) | (g < 250) | (b < 250)

# We want to isolate the text. Text is roughly in x > 440 and y between 350 and 600.
# Let's run a simple BFS or just use scipy
try:
    from scipy.ndimage import label, find_objects
    labeled_array, num_features = label(is_not_white)
    
    text_mask = np.zeros_like(is_not_white)
    
    # Iterate over features
    for i, slice_tuple in enumerate(find_objects(labeled_array)):
        if slice_tuple is None:
            continue
        
        y_slice, x_slice = slice_tuple
        y_min, y_max = y_slice.start, y_slice.stop
        x_min, x_max = x_slice.start, x_slice.stop
        
        # If the feature is mostly in the text region, it's text!
        if x_min > 440 and y_min > 300 and y_max < 650:
            text_mask[labeled_array == (i+1)] = True

    print("Extracted text features. Text mask has", np.sum(text_mask), "pixels.")
    
    # Save the isolated text and icon
    rgba_text = np.zeros((data.shape[0], data.shape[1], 4), dtype=np.uint8)
    rgba_text[text_mask, 0] = 245
    rgba_text[text_mask, 1] = 238
    rgba_text[text_mask, 2] = 224
    rgba_text[text_mask, 3] = 255
    Image.fromarray(rgba_text, 'RGBA').save('extracted_text.png')
    
    icon_mask = is_not_white & (~text_mask)
    rgba_icon = np.zeros((data.shape[0], data.shape[1], 4), dtype=np.uint8)
    rgba_icon[icon_mask, 0] = 245
    rgba_icon[icon_mask, 1] = 238
    rgba_icon[icon_mask, 2] = 224
    rgba_icon[icon_mask, 3] = 255
    Image.fromarray(rgba_icon, 'RGBA').save('extracted_icon.png')
    
except Exception as e:
    print("Error:", e)

