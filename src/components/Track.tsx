import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimulationStore } from '@/store'
import { latLonToScene } from '@/utils/coordinates'

export function Track() {
  const lines = useSimulationStore(s => s.lines)
  
  const trackMeshes = useMemo(() => {
    return lines.map(line => {
      const points = line.polyline.map(([lat, lon]) => {
        const { x, z } = latLonToScene(lat, lon)
        return new THREE.Vector3(x, 0.35, z)
      })
      
      // Create a smooth curve through points
      const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5)
      
      // Create tube geometry for track bed
      const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.12, 8, false)
      
      // Create line geometry for rails on top
      const railPoints = curve.getPoints(100)
      const railGeometry = new THREE.BufferGeometry().setFromPoints(railPoints)
      
      return {
        line,
        tubeGeometry,
        railGeometry,
        railPoints
      }
    })
  }, [lines])
  
  return (
    <group>
      {trackMeshes.map(({ line, tubeGeometry, railGeometry }) => (
        <group key={line.id}>
          {/* Track bed */}
          <mesh geometry={tubeGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color="#4a4a4a"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          
          {/* Rail line on top */}
          <line geometry={railGeometry}>
            <lineBasicMaterial color="#888888" linewidth={2} />
          </line>
        </group>
      ))}
    </group>
  )
}
