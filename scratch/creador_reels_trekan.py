import os
from moviepy.editor import VideoFileClip, concatenate_videoclips

def crear_reel_waldorf(carpeta_origen, archivo_salida):
    archivos = [f for f in os.listdir(carpeta_origen) if f.endswith('.mp4')]
    archivos.sort()
    
    if not archivos:
        print(f"❌ No se encontraron videos .mp4 en {carpeta_origen}")
        return

    print(f"🌱 Creando Reel Waldorf con {len(archivos)} clips...")
    clips = []
    
    for archivo in archivos:
        ruta = os.path.join(carpeta_origen, archivo)
        clip = VideoFileClip(ruta).subclip(0, min(3.5, VideoFileClip(ruta).duration))
        clip = clip.resize(height=1920).crop(x_center=clip.w/2, width=1080)
        clip = clip.crossfadein(1)
        clips.append(clip)

    video_final = concatenate_videoclips(clips, padding=-1, method="compose")
    
    print(f"🎬 Exportando video final a {archivo_salida}...")
    video_final.write_videofile(archivo_salida, fps=60, codec="libx264", audio_codec="aac", preset="fast", threads=4)
    print("✅ Reel exportado exitosamente.")

if __name__ == "__main__":
    os.makedirs("scratch/clips_crudos", exist_ok=True)
    crear_reel_waldorf("scratch/clips_crudos", "scratch/reel_admision_2027.mp4")
