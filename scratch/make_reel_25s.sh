#!/bin/bash
FFMPEG="/Users/felipeandresvivancocornejo/Library/Python/3.9/lib/python/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"
BASE_DIR="/Users/felipeandresvivancocornejo/Desktop/Crudos"

cd "$BASE_DIR"

echo "Procesando clip 1..."
"$FFMPEG" -y -i "2026-08-26 11.29.04.mp4" -ss 00:00:00 -t 00:00:03 -vf "scale=-1:1920,crop=1080:1920,eq=saturation=1.3:gamma=1.05:contrast=1.05" -c:a aac -b:a 128k -c:v libx264 -preset fast -crf 23 clip1.mp4

echo "Procesando clip 2..."
"$FFMPEG" -y -i "2026-08-26 11.29.51.mp4" -ss 00:00:00 -t 00:00:04 -vf "scale=-1:1920,crop=1080:1920,eq=saturation=1.3:gamma=1.05:contrast=1.05" -c:a aac -b:a 128k -c:v libx264 -preset fast -crf 23 clip2.mp4

echo "Procesando clip 3..."
"$FFMPEG" -y -i "2026-08-26 11.30.17.mp4" -ss 00:00:03 -t 00:00:04 -vf "scale=-1:1920,crop=1080:1920,eq=saturation=1.3:gamma=1.05:contrast=1.05" -c:a aac -b:a 128k -c:v libx264 -preset fast -crf 23 clip3.mp4

echo "Procesando clip 4..."
"$FFMPEG" -y -i "2026-08-26 11.30.44.mp4" -ss 00:00:05 -t 00:00:04 -vf "scale=-1:1920,crop=1080:1920,eq=saturation=1.3:gamma=1.05:contrast=1.05" -c:a aac -b:a 128k -c:v libx264 -preset fast -crf 23 clip4.mp4

echo "Procesando clip 5..."
"$FFMPEG" -y -i "2026-08-26 11.35.00.mp4" -ss 00:00:01 -t 00:00:04 -vf "scale=-1:1920,crop=1080:1920,eq=saturation=1.3:gamma=1.05:contrast=1.05" -c:a aac -b:a 128k -c:v libx264 -preset fast -crf 23 clip5.mp4

echo "Procesando clip 6..."
"$FFMPEG" -y -i "2026-08-26 11.35.16.mp4" -ss 00:00:00 -t 00:00:03 -vf "scale=-1:1920,crop=1080:1920,eq=saturation=1.3:gamma=1.05:contrast=1.05" -c:a aac -b:a 128k -c:v libx264 -preset fast -crf 23 clip6.mp4

echo "Procesando clip 7..."
"$FFMPEG" -y -i "2026-08-26 11.35.45.mp4" -ss 00:00:02 -t 00:00:03 -vf "scale=-1:1920,crop=1080:1920,eq=saturation=1.3:gamma=1.05:contrast=1.05" -c:a aac -b:a 128k -c:v libx264 -preset fast -crf 23 clip7.mp4

echo "Uniendo clips..."
cat << 'TXT' > inputs.txt
file 'clip1.mp4'
file 'clip2.mp4'
file 'clip3.mp4'
file 'clip4.mp4'
file 'clip5.mp4'
file 'clip6.mp4'
file 'clip7.mp4'
TXT

"$FFMPEG" -y -f concat -safe 0 -i inputs.txt -c copy Trekan_Reel_Oficial_25s_Final.mp4

# Limpiar temporales
rm clip1.mp4 clip2.mp4 clip3.mp4 clip4.mp4 clip5.mp4 clip6.mp4 clip7.mp4 inputs.txt

echo "¡Reel extendido creado exitosamente!"
