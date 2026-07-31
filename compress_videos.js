const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const videosToCompress = [
  'Candlelight_glow_in_forest_202607082057.mp4',
  'Waldorf_school_logo_animation_202607082053.mp4'
];

const publicDir = path.join(__dirname, 'public', 'imagenes-web');

async function compressVideo(filename) {
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, `compressed_${filename}`);

  console.log(`Starting compression for: ${filename}`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vcodec libx264',
        '-crf 30',          // Constant Rate Factor (higher = more compression, 30 is good for web backgrounds)
        '-preset medium',     // Speed vs compression ratio
        '-an'               // Remove audio (it's a background video anyway)
      ])
      .size('1280x?')       // Resize to 720p equivalent width to save massive space
      .on('end', () => {
        console.log(`Finished compression for: ${filename}`);
        // Replace original with compressed
        fs.renameSync(outputPath, inputPath);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error compressing ${filename}:`, err);
        reject(err);
      })
      .save(outputPath);
  });
}

async function run() {
  for (const video of videosToCompress) {
    try {
      await compressVideo(video);
      const stats = fs.statSync(path.join(publicDir, video));
      console.log(`New size for ${video}: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    } catch (e) {
      console.error(e);
    }
  }
}

run();
