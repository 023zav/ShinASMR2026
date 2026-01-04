import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
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
      
      // Create points array for rail line
      const railPoints = curve.getPoints(100).map(p => [p.x, p.y + 0.05, p.z] as [number, number, number])
      
      return {
        line,
        tubeGeometry,
        railPoints
      }
    })
  }, [lines])
  
  return (
    <group>
      {trackMeshes.map(({ line, tubeGeometry, railPoints }) => (
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
          <Line
            points={railPoints}
            color="#888888"
            lineWidth={2}
          />
        </group>
      ))}
    </group>
  )
}
