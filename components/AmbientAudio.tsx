'use client'

import { useState, useRef, useEffect } from 'react'
import { VolumeX } from 'lucide-react'

export default function AmbientAudio({ isDark = false }: { isDark?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Inicializar el elemento de audio con el paisaje sonoro orgánico
    const audio = new Audio('/audio/calm_nature_glow.mp3')
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const toggleSound = () => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)

    if (isPlaying) {
      // Fade out suave (300ms)
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.08)
        } else {
          audio.volume = 0
          audio.pause()
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
          setIsPlaying(false)
        }
      }, 30)
    } else {
      // Iniciar reproducción y fade in (400ms) hasta un volumen suave de fondo (0.35)
      audio.play().then(() => {
        setIsPlaying(true)
        fadeIntervalRef.current = setInterval(() => {
          if (audio.volume < 0.32) {
            audio.volume = Math.min(0.35, audio.volume + 0.05)
          } else {
            audio.volume = 0.35
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
          }
        }, 40)
      }).catch(() => {
        // Autoplay bloqueado por el navegador
        setIsPlaying(false)
      })
    }
  }

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? "Silenciar sonido ambiente" : "Activar sonido ambiente del bosque"}
      aria-label={isPlaying ? "Silenciar sonido ambiente" : "Activar sonido ambiente del bosque"}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${
        isDark 
          ? isPlaying 
            ? 'bg-[#EBBA7A]/20 text-[#EBBA7A] border-[#EBBA7A]/50 shadow-sm' 
            : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border-white/20 shadow-sm'
          : isPlaying
            ? 'bg-[var(--color-waldorf-moss)] text-[#FAF8F5] border-[var(--color-waldorf-moss)] shadow-xs'
            : 'bg-white/80 hover:bg-white text-[var(--color-waldorf-moss)] border-[var(--color-waldorf-sage)]/30 shadow-xs'
      }`}
    >
      {/* Micro ecualizador animado */}
      <div className="flex items-center gap-[2.5px] h-3 w-3 justify-center">
        {isPlaying ? (
          <>
            <span className="w-[2px] h-2.5 bg-current rounded-full animate-[soundWave_0.8s_ease-in-out_infinite]" />
            <span className="w-[2px] h-3 bg-current rounded-full animate-[soundWave_0.8s_ease-in-out_0.2s_infinite]" />
            <span className="w-[2px] h-1.5 bg-current rounded-full animate-[soundWave_0.8s_ease-in-out_0.4s_infinite]" />
          </>
        ) : (
          <VolumeX size={13} className="opacity-70 group-hover:opacity-100" />
        )}
      </div>

      <span className="hidden sm:inline text-[11px] font-mono tracking-wider uppercase font-medium">
        {isPlaying ? 'Ambiente ON' : 'Sonido'}
      </span>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundWave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}} />
    </button>
  )
}
