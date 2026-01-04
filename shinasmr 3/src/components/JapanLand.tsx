import { useMemo } from 'react'
import * as THREE from 'three'
import { JAPAN_SILHOUETTE } from '@/data/japan-silhouette'
import { latLonToScene } from '@/utils/coordinates'

export function JapanLand() {
  const shapes = useMemo(() => {
    return JAPAN_SILHOUETTE.map(island => {
      const shape = new THREE.Shape()
      const points = island.map(([lat, lon]) => latLonToScene(lat, lon))
      
      if (points.length === 0) return null
      
      shape.moveTo(points[0].x, points[0].z)
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].z)
      }
      shape.closePath()
      
      return shape
    }).filter(Boolean) as THREE.Shape[]
  }, [])
  
  const extrudeSettings = useMemo(() => ({
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2
  }), [])
  
  return (
    <group>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
          castShadow
        >
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial
            color="#2d4a3e"
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
      ))}
    </group>
  )
}
