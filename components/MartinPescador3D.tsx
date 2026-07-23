'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  // Movimiento sutil siguiendo el mouse
  useFrame((state) => {
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 8
      const targetY = (state.pointer.y * Math.PI) / 8
      
      // Interpolación suave para sentirse orgánico (madera)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05)
    }
  })

  return (
    <group ref={groupRef} dispose={null} scale={1.2}>
      <primitive object={scene} />
    </group>
  )
}

export default function MartinPescador3D() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-8 right-8 w-[220px] h-[220px] z-[40] hidden md:block">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
        <ambientLight intensity={0.6} />
        {/* Luz principal */}
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        
        {/* Luz cálida tipo atardecer para resaltar la madera (Golden Hour) */}
        <pointLight position={[-5, 5, -5]} color="#f2a85c" intensity={1.5} />
        <pointLight position={[5, -5, 5]} color="#5cf2a8" intensity={0.3} />
        
        <Environment preset="forest" />
        
        <PresentationControls 
          global 
          config={{ mass: 2, tension: 500 }} 
          snap={true}
          rotation={[0, -0.5, 0]} 
          polar={[-Math.PI / 4, Math.PI / 4]} 
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <Float 
            speed={1.2} 
            rotationIntensity={0.3} 
            floatIntensity={0.6} 
            floatingRange={[-0.1, 0.1]} 
          >
            <Model url="/assets/3d/martinpescador.glb" />
          </Float>
        </PresentationControls>
      </Canvas>
    </div>
  )
}
