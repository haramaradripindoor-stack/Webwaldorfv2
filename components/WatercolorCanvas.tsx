'use client';

import React, { useEffect, useRef } from 'react';

/**
 * WatercolorCanvas — Shader Procedural de Acuarela Viva sobre Papel Húmedo
 * Inspirado en la Teoría de los Colores de Goethe y la técnica artística canónica Waldorf.
 * 
 * Implementación WebGL 1.0/2.0 pura sin dependencias externas:
 * - Domain warping fractal (fBm) simulando la dispersión de pigmento vegetal en papel de algodón mojado.
 * - Paleta noble: Musgo de Bosque (#1E3A2C), Ocre Dorado (#DDA752) y Terracota (#B85437).
 * - Reactividad al cursor con inercia y amortiguación física.
 * - Desconexión automática en background y respeto estricto a prefers-reduced-motion.
 */
export default function WatercolorCanvas({
  className = '',
  opacity = 0.45,
  interactive = true,
}: {
  className?: string;
  opacity?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respetar prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      antialias: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Acuarela fractal suave con dispersión de Goethe
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_opacity;
      varying vec2 v_uv;

      // Generador de ruido procedural rápido (Simplex/Perlin simplificado)
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                           -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractional Brownian Motion (fBm) para dispersión de fluidos
      float fbm(vec2 p) {
        float f = 0.0;
        f += 0.5000 * snoise(p); p = p * 2.02;
        f += 0.2500 * snoise(p); p = p * 2.03;
        f += 0.1250 * snoise(p); p = p * 2.01;
        return f;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;

        vec2 mouse = u_mouse * vec2(aspect, 1.0);
        float mouseDist = length(st - mouse);
        float mouseInfluence = smoothstep(0.45, 0.0, mouseDist);

        // Deformación de dominio (Domain Warping) que emula pigmento difundiéndose en agua
        float t = u_time * 0.07;
        vec2 q = vec2(
          fbm(st + vec2(0.0, t * 0.3) + mouseInfluence * 0.15),
          fbm(st + vec2(5.2, 1.3) + t * 0.4 - mouseInfluence * 0.12)
        );

        vec2 r = vec2(
          fbm(st + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t),
          fbm(st + 3.0 * q + vec2(8.3, 2.8) + 0.12 * t)
        );

        float f = fbm(st + 4.0 * r);

        // Paleta Waldorf: Musgo Patagónico, Alerce Cálido y Terracota
        vec3 colForest = vec3(0.10, 0.21, 0.15); // #1A3526
        vec3 colGold   = vec3(0.86, 0.65, 0.32); // #DDA752
        vec3 colTerra  = vec3(0.72, 0.33, 0.21); // #B85437
        vec3 colLinen  = vec3(0.98, 0.97, 0.95); // #FAF8F5

        // Mezcla cromática suave (acuarela de tres tintas)
        vec3 color = mix(colForest, colGold, clamp((f * f) * 3.5, 0.0, 1.0));
        color = mix(color, colTerra, clamp(length(q), 0.0, 1.0) * 0.6);
        color = mix(colLinen, color, clamp(f * 1.8 + 0.2, 0.0, 1.0));

        // Resplandor del cursor (tinta flotante)
        color = mix(color, colGold, mouseInfluence * 0.25);

        // Transparencia sutil y orgánica
        float alpha = clamp((1.0 - color.r * 0.4) * u_opacity, 0.0, 0.85);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    function createShader(type: number, source: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    // Buffer de coordenadas de pantalla completa
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const opacityLocation = gl.getUniformLocation(program, 'u_opacity');

    let animationFrameId: number;
    let startTime = performance.now();
    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    let isVisible = true;

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Limitar a 1.5x DPR para 60/120 FPS
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    }

    function handleMouseMove(e: MouseEvent) {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // Invertir Y para WebGL
      mouse.targetX = x;
      mouse.targetY = y;
    }

    function handleTouchMove(e: TouchEvent) {
      if (!interactive || !canvas || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1.0 - (touch.clientY - rect.top) / rect.height;
      mouse.targetX = x;
      mouse.targetY = y;
    }

    // Observer de visibilidad para suspender render cuando no está en pantalla
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });

    observer.observe(canvas);

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    resize();

    function render(currentTime: number) {
      if (!isVisible || document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Inercia física del cursor (suavizado elástico franchu.web)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const elapsed = (currentTime - startTime) * 0.001;

      if (gl && canvas) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseLocation, mouse.x, mouse.y);
        gl.uniform1f(timeLocation, elapsed);
        gl.uniform1f(opacityLocation, opacity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [opacity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none select-none transition-opacity duration-1000 ${className}`}
      style={{ willChange: 'transform, opacity' }}
      aria-hidden="true"
    />
  );
}
