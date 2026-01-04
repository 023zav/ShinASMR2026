import { Canvas } from '@react-three/fiber'
import { OrthographicCamera, MapControls } from '@react-three/drei'
import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useSimulationStore } from '@/store'
import { Ocean } from './Ocean'
import { JapanLand } from './JapanLand'
import { Track } from './Track'
import { Stations } from './Stations'
import { Trains } from './Trains'
import { useSimulationLoop } from '@/hooks/useSimulationLoop'
import { latLonToScene } from '@/utils/coordinates'
import { TOKAIDO_BOUNDS } from '@/data/japan-silhouette'

interface SceneProps {
  onReady?: () => void
}

function SceneContent({ onReady }: SceneProps) {
  const controlsRef = useRef<any>(null)
  const cameraRef = useRef<THREE.OrthographicCamera>(null)
  
  const followingTrainId = useSimulationStore(s => s.followingTrainId)
  const trainPositions = useSimulationStore(s => s.trainPositions)
  const reducedMotion = useSimulationStore(s => s.reducedMotion)
  
  // Start simulation loop
  useSimulationLoop()
  
  // Calculate initial camera position centered on Tokaido corridor
  const initialTarget = useMemo(() => {
    return latLonToScene(TOKAIDO_BOUNDS.centerLat, TOKAIDO_BOUNDS.centerLon)
  }, [])
  
  // Camera zoom level
  const zoom = 40
  
  // Signal ready after first render
  useEffect(() => {
    onReady?.()
  }, [onReady])
  
  // Follow train logic
  useEffect(() => {
    if (!followingTrainId || !controlsRef.current || !cameraRef.current) return
    
    const position = trainPositions.get(followingTrainId)
    if (!position) return
    
    const { x, z } = latLonToScene(position.lat, position.lon)
    
    // Smooth camera movement
    const controls = controlsRef.current
    const targetVec = new THREE.Vector3(x, 0, z)
    
    if (reducedMotion) {
      controls.target.copy(targetVec)
    } else {
      controls.target.lerp(targetVec, 0.05)
    }
    
    controls.update()
  })
  
  return (
    <>
      {/* Isometric orthographic camera */}
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        zoom={zoom}
        position={[
          initialTarget.x + 20,
          25,
          initialTarget.z + 20
        ]}
        near={0.1}
        far={1000}
      />
      
      {/* Controls */}
      <MapControls
        ref={controlsRef}
        target={[initialTarget.x, 0, initialTarget.z]}
        enableRotate={false}
        enableDamping={!reducedMotion}
        dampingFactor={0.1}
        minZoom={10}
        maxZoom={200}
        screenSpacePanning
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-30, 50, -30]}
        intensity={0.3}
      />
      
      {/* Scene elements */}
      <Ocean />
      <JapanLand />
      <Track />
      <Stations />
      <Trains />
    </>
  )
}

export function Scene({ onReady }: SceneProps) {
  return (
    <Canvas
      gl={{ 
        antialias: true,
        powerPreference: 'high-performance'
      }}
      dpr={[1, 2]}
      style={{ background: '#0a1628' }}
    >
      <SceneContent onReady={onReady} />
    </Canvas>
  )
}
