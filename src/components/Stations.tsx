import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSimulationStore } from '@/store'
import { latLonToScene } from '@/utils/coordinates'

interface StationMarkerProps {
  id: string
  name: string
  position: THREE.Vector3
  isSelected: boolean
  onClick: () => void
}

function StationMarker({ name, position, isSelected, onClick }: StationMarkerProps) {
  return (
    <group position={position}>
      {/* Platform base */}
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        <boxGeometry args={[0.6, 0.15, 0.3]} />
        <meshStandardMaterial
          color={isSelected ? '#0ea5e9' : '#94a3b8'}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      
      {/* Station building */}
      <mesh
        position={[0, 0.25, 0.1]}
        castShadow
      >
        <boxGeometry args={[0.4, 0.35, 0.15]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : '#e2e8f0'}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Station label */}
      <Html
        position={[0, 0.8, 0]}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <div
          style={{
            background: isSelected ? 'rgba(14, 165, 233, 0.9)' : 'rgba(30, 41, 59, 0.85)',
            color: '#f1f5f9',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: isSelected ? 600 : 400,
            whiteSpace: 'nowrap',
            border: isSelected ? '1px solid #38bdf8' : '1px solid #475569',
            backdropFilter: 'blur(4px)'
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  )
}

export function Stations() {
  const stations = useSimulationStore(s => s.stations)
  const selectedStationId = useSimulationStore(s => s.selectedStationId)
  const selectStation = useSimulationStore(s => s.selectStation)
  
  const stationPositions = useMemo(() => {
    return stations.map(station => {
      const { x, z } = latLonToScene(station.lat, station.lon)
      return {
        ...station,
        position: new THREE.Vector3(x, 0.35, z)
      }
    })
  }, [stations])
  
  return (
    <group>
      {stationPositions.map(station => (
        <StationMarker
          key={station.id}
          id={station.id}
          name={station.name_en}
          position={station.position}
          isSelected={selectedStationId === station.id}
          onClick={() => selectStation(station.id)}
        />
      ))}
    </group>
  )
}
