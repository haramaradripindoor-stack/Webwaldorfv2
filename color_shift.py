from PIL import Image
import cv2
import numpy as np

def shift_to_olive(image_path, out_path):
    img = cv2.imread(image_path)
    
    # Convert BGR to HSV
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Moss Green to Olive Green
    # We want to shift the Hue slightly towards yellow/brown
    # and maybe decrease saturation slightly.
    
    # In OpenCV, Hue is 0-179.
    # Green is around 35-85.
    
    # Let's adjust Hue
    # We subtract a bit from the hue to move it from green to yellow-green
    hsv = np.array(hsv, dtype=np.float64)
    hsv[:,:,0] -= 12 # Shift hue
    
    # Keep hue in 0-179 bounds
    hsv[:,:,0] = np.mod(hsv[:,:,0], 180)
    
    # Decrease saturation slightly
    hsv[:,:,1] *= 0.85 
    
    hsv = np.clip(hsv, 0, 255).astype(np.uint8)
    
    res = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    cv2.imwrite(out_path, res)
    print("Saved shifted image:", out_path)

base_dir = '/Users/felipeandresvivancocornejo/.gemini/antigravity/brain/eb4196d4-9aed-4a41-ac29-86a9641094a0/'
moss_in = base_dir + 'hoodie_moss_back_1790096898725.jpg'
olive_blank = base_dir + 'olive_back_shifted.jpg'

shift_to_olive(moss_in, olive_blank)
