import { useMemo } from 'react'
import * as THREE from 'three'

export function Ocean() {
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(500, 500)
  }, [])
  
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#1e3a5f"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}
