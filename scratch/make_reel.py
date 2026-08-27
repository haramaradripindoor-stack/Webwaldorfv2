import os
from moviepy import *

def process_video(filepath, start_time, duration=3):
    print(f"Procesando {filepath}...")
    # Cargar el clip
    clip = VideoFileClip(filepath)
    
    # Cortar el clip
    end_time = min(start_time + duration, clip.duration)
    subclip = clip.subclip(start_time, end_time)
    
    # Escalar o recortar para asegurar formato vertical de Reel (9:16) - 1080x1920
    # Usaremos resize y crop
    target_ratio = 1080 / 1920
    clip_ratio = subclip.w / subclip.h
    
    if clip_ratio > target_ratio:
        # El video es más ancho que 9:16 (ej. 16:9), recortar los lados
        subclip = subclip.resized(height=1920)
        subclip = subclip.cropped(x_center=subclip.w/2, width=1080)
    else:
        # El video es más alto o igual, escalar ancho y recortar arriba/abajo
        subclip = subclip.resized(width=1080)
        subclip = subclip.cropped(y_center=subclip.h/2, height=1920)
        
    return subclip

def main():
    base_dir = "/Users/felipeandresvivancocornejo/Desktop/Crudos"
    
    # Los 4 videos elegidos según el Shot List
    # Ajusta el start_time (segundos) según el mejor momento de cada clip
    videos = [
        {"file": "2026-08-26 11.29.04.mp4", "start": 0},  # Motricidad (Madera)
        {"file": "2026-08-26 11.29.51.mp4", "start": 2},  # Naturaleza (Carretilla)
        {"file": "2026-08-26 11.30.17.mp4", "start": 3},  # Juego (Hojas)
        {"file": "2026-08-26 11.35.00.mp4", "start": 1}   # Vínculo (Ronda)
    ]
    
    clips = []
    for v in videos:
        filepath = os.path.join(base_dir, v["file"])
        if os.path.exists(filepath):
            clips.append(process_video(filepath, v["start"], 3))
        else:
            print(f"¡Error! No se encontró {filepath}")
            
    if not clips:
        print("No se encontraron videos para procesar.")
        return

    print("Uniendo clips...")
    final_clip = concatenate_videoclips(clips, method="compose")
    
    output_path = os.path.join(base_dir, "Trekan_Reel_Oficial.mp4")
    print(f"Exportando Reel a {output_path}...")
    
    # Exportar (usamos libx264 para máxima compatibilidad con Instagram)
    final_clip.write_videofile(
        output_path, 
        fps=30, 
        codec="libx264", 
        audio_codec="aac",
        preset="fast",
        threads=4
    )
    print("¡Reel exportado exitosamente!")

if __name__ == "__main__":
    main()
