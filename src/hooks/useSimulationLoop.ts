import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSimulationStore } from '@/store'

export function useSimulationLoop() {
  const tick = useSimulationStore(s => s.tick)
  const lastTimeRef = useRef(performance.now())
  
  useFrame(() => {
    const now = performance.now()
    const delta = now - lastTimeRef.current
    lastTimeRef.current = now
    
    tick(delta)
  })
}

// Non-R3F version for use outside Canvas
export function useSimulationLoopOutsideCanvas() {
  const tick = useSimulationStore(s => s.tick)
  
  useEffect(() => {
    let lastTime = performance.now()
    let animationId: number
    
    const loop = () => {
      const now = performance.now()
      const delta = now - lastTime
      lastTime = now
      
      tick(delta)
      animationId = requestAnimationFrame(loop)
    }
    
    animationId = requestAnimationFrame(loop)
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [tick])
}
