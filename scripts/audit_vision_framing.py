#!/usr/bin/env python3
"""
Colegio Waldorf Trekan — Vision Framing & Composition Auditor (OpenCV)
Detects faces, salient subject center of mass, and validates framing
across all UI components to prevent severed heads, feet crops, or bad framing.
"""

import cv2
import os
import sys

def audit_image(image_path, target_ratio=1.6):
    """
    Analyzes an image to find the optimal object-position (e.g. 'object-top', 'object-center', etc.)
    target_ratio: width / height of container
    """
    if not os.path.exists(image_path):
        return {"error": f"File not found: {image_path}"}

    img = cv2.imread(image_path)
    if img is None:
        return {"error": f"Failed to decode: {image_path}"}

    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))

    if len(faces) > 0:
        # Compute bounding box of all faces
        min_y = min(f[1] for f in faces)
        max_y = max(f[1] + f[3] for f in faces)
        center_y_face = (min_y + max_y) / 2.0
        face_pct_y = (center_y_face / h) * 100.0

        # If faces are in upper 40%, recommended CSS is object-top or object-[center_20%]
        if face_pct_y < 35:
            suggested_pos = "object-top"
        elif face_pct_y < 55:
            suggested_pos = "object-center"
        else:
            suggested_pos = "object-bottom"

        return {
            "path": image_path,
            "dimensions": f"{w}x{h}",
            "faces_detected": len(faces),
            "face_y_percent": round(face_pct_y, 1),
            "suggested_css": suggested_pos,
            "status": "FACES_DETECTED"
        }
    else:
        # Saliency / edge density center of mass
        edges = cv2.Canny(gray, 50, 150)
        y_indices, x_indices = edges.nonzero()
        if len(y_indices) > 0:
            mean_y = y_indices.mean()
            saliency_pct_y = (mean_y / h) * 100.0
            if saliency_pct_y < 35:
                suggested_pos = "object-top"
            elif saliency_pct_y < 60:
                suggested_pos = "object-center"
            else:
                suggested_pos = "object-bottom"
        else:
            suggested_pos = "object-center"

        return {
            "path": image_path,
            "dimensions": f"{w}x{h}",
            "faces_detected": 0,
            "suggested_css": suggested_pos,
            "status": "OBJECT_CENTER_OF_MASS"
        }

if __name__ == '__main__':
    images_to_audit = [
        "public/imagenes-web/puedes-bailar-teatro-del-lago-expresion-movimiento.webp",
        "public/assets/pilares/aula_madera_ventanales.webp",
        "public/imagenes-web/fiestas-2026/_MG_5515.webp",
        "public/assets/bento/bento_pizarra_inmersion.webp",
        "public/imagenes-web/equipoescolar.jpg",
        "public/assets/pilares/comunidad_admision_ronda.webp",
        "public/imagenes-web/pentatlon-waldorf-patio-comunidad.webp",
        "public/imagenes-web/pentatlon-waldorf-circulo-manos.webp",
        "public/imagenes-web/fiesta de la luz20268.jpg",
        "public/imagenes-web/comisionobraymantencion2.webp",
        "public/imagenes-web/fiestas-2026/_MG_5465.webp",
        "public/imagenes-web/pentatlon-waldorf-descanso-bancas.webp",
        "public/imagenes-web/alquimia-teatro-del-lago-actuacion-escena.webp",
        "public/imagenes-web/fiesta de la luz202610.jpg",
        "public/imagenes-web/pentatlon-waldorf-coronacion-laurel.webp",
        "public/imagenes-web/paseocerro20264.jpg",
        "public/imagenes-web/fiestas-2026/_MG_5514.webp"
    ]

    print("=== TREKAN COMPUTER VISION FRAMING AUDIT ===")
    for img_p in images_to_audit:
        res = audit_image(img_p)
        print(f"[{res.get('status')}] {res.get('path')} -> {res.get('dimensions')} -> {res.get('suggested_css')} (faces: {res.get('faces_detected', 0)})")
