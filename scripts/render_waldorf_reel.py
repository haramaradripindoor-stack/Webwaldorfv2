#!/usr/bin/env python3
"""
🎬 Motor Automatizado de Reels Waldorf para Colegio Waldorf Trekan
==================================================================
Compila y renderiza videos verticales en 9:16 (1080x1920) optimizados para
Instagram Reels y TikTok utilizando metraje RAW de alta resolución (Full HD nativo),
MoviePy 2.x, Pillow, y aceleración por hardware VideoToolbox en Apple Silicon.

Hito: Encuentro Nacional de Pentatlón Waldorf 2026 en San Felipe
"""

import os
import sys
import shutil
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from moviepy import (
    VideoFileClip,
    ImageClip,
    AudioFileClip,
    CompositeVideoClip,
    CompositeAudioClip,
    concatenate_videoclips,
    concatenate_audioclips,
)
import moviepy.video.fx as vfx
import moviepy.audio.fx as afx

# Dimensiones estándar de Instagram Reels
TARGET_W = 1080
TARGET_H = 1920
TARGET_FPS = 30

# Paleta de color institucional Waldorf Trekan
COLOR_BG_BOX = (26, 46, 37, 225)      # Verde Musgo Oscuro #1A2E25 con 88% opacidad
COLOR_BORDER = (212, 155, 75, 230)     # Mostaza Cálido #D49B4B
COLOR_TEXT = (250, 248, 245, 255)      # Crema Suave #FAF8F5
COLOR_SHADOW = (10, 16, 13, 140)       # Sombra suave

def create_subtitle_card(text: str, output_png_path: str, font_path: str, font_size: int = 38, y_pos: int = 1320) -> str:
    """
    Genera una capa PNG transparente (1080x1920) con el texto formateado
    dentro de una caja traslúcida elegante en la zona segura inferior.
    """
    img = Image.new('RGBA', (TARGET_W, TARGET_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype(font_path, font_size)
    except Exception as e:
        print(f"⚠️ No se pudo cargar {font_path}, usando fuente por defecto: {e}")
        font = ImageFont.load_default()

    bbox = draw.multiline_textbbox((0, 0), text, font=font, align='center', spacing=14)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    # Centrar horizontalmente
    x = (TARGET_W - tw) // 2
    y = y_pos

    pad_x = 44
    pad_y = 26
    radius = 28

    box = [x - pad_x, y - pad_y, x + tw + pad_x, y + th + pad_y]
    shadow_box = [box[0] + 4, box[1] + 6, box[2] + 4, box[3] + 6]

    # Sombra difusa
    draw.rounded_rectangle(shadow_box, radius=radius, fill=COLOR_SHADOW)
    # Caja traslúcida con borde dorado mostaza
    draw.rounded_rectangle(box, radius=radius, fill=COLOR_BG_BOX, outline=COLOR_BORDER, width=2)
    # Texto crema centrado con soporte Unicode completo (ñ, tildes, comillas angulares)
    draw.multiline_text((x, y), text, font=font, fill=COLOR_TEXT, align='center', spacing=14)

    os.makedirs(os.path.dirname(output_png_path), exist_ok=True)
    img.save(output_png_path, "PNG")
    return output_png_path

def fit_to_9_16(clip, target_w=TARGET_W, target_h=TARGET_H):
    """
    Escala y recorta centralmente un clip para llenar exactamente 1080x1920 (9:16)
    sin deformar ni añadir barras negras laterales.
    """
    w, h = clip.size
    if w == target_w and h == target_h:
        return clip

    scale = max(target_w / w, target_h / h)
    new_w = int(round(w * scale))
    new_h = int(round(h * scale))
    
    resized = clip.resized((new_w, new_h))
    x1 = (new_w - target_w) // 2
    y1 = (new_h - target_h) // 2
    return resized.cropped(x1=x1, y1=y1, width=target_w, height=target_h)

def resolve_file(filename: str, search_dirs: list) -> str:
    """Busca un archivo en una lista de directorios en orden de prioridad."""
    for d in search_dirs:
        p = Path(d) / filename
        if p.exists():
            return str(p)
    raise FileNotFoundError(f"No se encontró '{filename}' en: {search_dirs}")

def build_pentatlon_reel(
    search_dirs: list,
    output_path: str,
    music_path: str,
    font_path: str,
    downloads_copy: str = None,
    ambient_volume: float = 0.35,
    music_volume: float = 0.55
):
    print("=" * 60)
    print("🌿 INICIANDO MOTOR DE RENDERIZADO REEL WALDORF TREKAN (RAW FULL HD)")
    print("=" * 60)
    print(f"📁 Directorios de búsqueda: {search_dirs}")
    print(f"🎯 Archivo destino: {output_path}")
    print(f"🎵 Pista musical: {music_path}")
    print(f"🖋️ Fuente tipográfica: {font_path}")

    temp_dir = Path("public/videos/.temp_subtitles")
    temp_dir.mkdir(parents=True, exist_ok=True)

    # Escaleta Canónica de Tomas y Textos Pedagógicos con metraje RAW de alta definición (26.5s)
    scenes_config = [
        {
            "file": "VID_20261024_073312.mp4",
            "type": "video",
            "start": 2.0,
            "end": 5.8,
            "duration": 3.8,
            "text": "A los 11 años ocurre algo irrepetible\nen el cuerpo de un niño."
        },
        {
            "file": "VID_20261024_085842.mp4",
            "type": "video",
            "start": 4.0,
            "end": 7.8,
            "duration": 3.8,
            "text": "Nuestra delegación viajó desde Puerto Varas\nal Encuentro Nacional en San Felipe."
        },
        {
            "file": "VID_20261024_091556.mp4",
            "type": "video",
            "start": 10.0,
            "end": 13.8,
            "duration": 3.8,
            "text": "En la Pentatlón Waldorf\nno compite un colegio contra otro...\ncompartimos las poleis griegas."
        },
        {
            "file": "VID_20261024_114745.mp4",
            "type": "video",
            "start": 15.0,
            "end": 18.8,
            "duration": 3.8,
            "text": "Cultivamos la «Kalokagathia»:\nla nobleza y la belleza en cada gesto."
        },
        {
            "file": "VID_20261024_124402.mp4",
            "type": "video",
            "start": 17.0,
            "end": 20.8,
            "duration": 3.8,
            "text": "Cada esfuerzo es reconocido\npor su entrega, nobleza y compañerismo."
        },
        {
            "file": "VID_20261024_132115.mp4",
            "type": "video",
            "start": 7.0,
            "end": 10.8,
            "duration": 3.8,
            "text": "Porque el verdadero encuentro humano\nculmina siempre en fraternidad."
        },
        {
            "file": "IMG_20261024_132919.jpg",
            "type": "image",
            "duration": 3.7,
            "text": "Colegio Waldorf Trekan · Puerto Varas\nAdmisión Abierta · Link en biografía"
        }
    ]

    total_duration = sum(s["duration"] for s in scenes_config)
    print(f"⏱️ Duración total proyectada: {total_duration:.1f} segundos")

    has_music = (
        music_path
        and music_path.lower() != 'none'
        and os.path.exists(music_path)
        and music_volume > 0.0
    )

    effective_ambient_vol = ambient_volume if has_music else 1.0
    print(f"🔊 Volumen ambiente: {effective_ambient_vol * 100:.0f}% | Música: {music_volume * 100:.0f}%" if has_music else "🔊 Volumen ambiente: 100% puro")

    processed_scenes = []
    ambient_audio_clips = []

    for i, s in enumerate(scenes_config, 1):
        source_path = resolve_file(s["file"], search_dirs)
        print(f"\n🎬 Procesando Escena {i}/{len(scenes_config)}: {s['file']} ({s['duration']}s)")

        # Renderizar tarjeta de subtítulo con Pillow (Merriweather Bold)
        sub_png = temp_dir / f"sub_scene_{i}.png"
        create_subtitle_card(s["text"], str(sub_png), font_path, font_size=38, y_pos=1320)

        # Cargar capa visual de subtítulo con disolvencia suave
        sub_clip = ImageClip(str(sub_png)).with_duration(s["duration"]).with_effects([
            vfx.CrossFadeIn(0.35),
            vfx.CrossFadeOut(0.35)
        ])

        if s["type"] == "video":
            raw_clip = VideoFileClip(source_path).subclipped(s["start"], s["end"])
            fitted_clip = fit_to_9_16(raw_clip)

            if raw_clip.audio is not None:
                amb_audio = raw_clip.audio.with_volume_scaled(effective_ambient_vol)
                ambient_audio_clips.append(amb_audio)
            
            scene_comp = CompositeVideoClip([fitted_clip, sub_clip], size=(TARGET_W, TARGET_H))
            processed_scenes.append(scene_comp)

        elif s["type"] == "image":
            raw_img = ImageClip(source_path).with_duration(s["duration"])
            fitted_img = fit_to_9_16(raw_img)
            scene_comp = CompositeVideoClip([fitted_img, sub_clip], size=(TARGET_W, TARGET_H))
            processed_scenes.append(scene_comp)

    print("\n🎞️ Concatenando escenas...")
    final_video = concatenate_videoclips(processed_scenes, method='compose')

    # 2. Orquestación y Mezcla de Pistas de Audio
    if has_music:
        print(f"\n🎵 Mezclando banda sonora ({music_path})...")
        raw_music = AudioFileClip(music_path)
        music_dur = min(total_duration, raw_music.duration)
        music_clip = raw_music.subclipped(0, music_dur).with_volume_scaled(music_volume)
        music_clip = music_clip.with_effects([
            afx.AudioFadeIn(0.8),
            afx.AudioFadeOut(1.5)
        ])

        if ambient_audio_clips:
            concat_ambient = concatenate_audioclips(ambient_audio_clips)
            final_audio = CompositeAudioClip([concat_ambient, music_clip])
        else:
            final_audio = music_clip
    else:
        print("\n🌿 Modo Audio Ambiente Puro...")
        final_audio = concatenate_audioclips(ambient_audio_clips) if ambient_audio_clips else None

    if final_audio is not None:
        final_video = final_video.with_audio(final_audio)

    # 3. Exportación Acelerada por Hardware (Apple Silicon VideoToolbox M1 Max)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    print(f"\n⚡ Exportando video a {output_path}...")
    
    try:
        final_video.write_videofile(
            output_path,
            fps=TARGET_FPS,
            codec='h264_videotoolbox',
            audio_codec='aac',
            bitrate='12000k',
            audio_bitrate='192k',
            logger='bar'
        )
        print("✅ Renderizado completado exitosamente con aceleración Apple Silicon VideoToolbox!")
    except Exception as e:
        print(f"⚠️ VideoToolbox falló ({e}). Usando codificador libx264...")
        final_video.write_videofile(
            output_path,
            fps=TARGET_FPS,
            codec='libx264',
            preset='fast',
            audio_codec='aac',
            bitrate='12000k',
            audio_bitrate='192k',
            logger='bar'
        )

    # 4. Copiar a la carpeta Descargas
    if downloads_copy:
        os.makedirs(os.path.dirname(downloads_copy), exist_ok=True)
        shutil.copy2(output_path, downloads_copy)
        print(f"📦 Copia Master exportada a Descargas: {downloads_copy}")

    # Limpiar temporales
    shutil.rmtree(temp_dir, ignore_errors=True)

    print("\n" + "=" * 60)
    print("✨ REEL MASTER LISTO PARA PUBLICAR EN INSTAGRAM Y WEB")
    print("=" * 60)
    print(f"📹 Ruta Web: {output_path}")
    if downloads_copy:
        print(f"📥 Ruta Mac: {downloads_copy}")
    print(f"📐 Resolución: {TARGET_W}x{TARGET_H} (9:16 Full HD)")
    print(f"⏱️ Duración: {total_duration:.1f} segundos")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Renderizador Automatizado de Reels Waldorf Trekan")
    parser.add_argument('--output', default='public/videos/reel_pentatlon_san_felipe_2026.mp4', help='Ruta destino del video')
    parser.add_argument('--music', default='public/audio/calm_nature_glow.mp3', help='Ruta del audio de fondo')
    parser.add_argument('--font', default='public/fonts/Merriweather-Bold.ttf', help='Ruta de la fuente tipográfica')
    parser.add_argument('--downloads', default='/Users/felipeandresvivancocornejo/Downloads/reel_pentatlon_san_felipe_2026.mp4', help='Copia a descargas')
    parser.add_argument('--ambient-vol', type=float, default=0.35, help='Volumen audio ambiente (0.0 a 1.0)')
    parser.add_argument('--music-vol', type=float, default=0.55, help='Volumen música acústica (0.0 a 1.0)')

    args = parser.parse_args()

    search_directories = [
        '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026',
        '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 2',
        '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 3',
        '/Users/felipeandresvivancocornejo/Downloads/PENTATLON 2026 4'
    ]

    build_pentatlon_reel(
        search_dirs=search_directories,
        output_path=args.output,
        music_path=args.music,
        font_path=args.font,
        downloads_copy=args.downloads,
        ambient_volume=args.ambient_vol,
        music_volume=args.music_vol
    )
