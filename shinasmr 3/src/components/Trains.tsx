import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSimulationStore } from '@/store'
import { latLonToScene } from '@/utils/coordinates'

// Livery colors for different train types
const LIVERY_COLORS: Record<string, { body: string; stripe: string; nose: string }> = {
  'white-blue': {
    body: '#f8fafc',
    stripe: '#0066cc',
    nose: '#0066cc'
  },
  'white-orange': {
    body: '#f8fafc',
    stripe: '#f97316',
    nose: '#f97316'
  },
  'white-green': {
    body: '#f8fafc',
    stripe: '#22c55e',
    nose: '#22c55e'
  }
}

interface TrainProps {
  serviceId: string
  isSelected: boolean
  onClick: () => void
}

function Train({ serviceId, isSelected, onClick }: TrainProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  const trainPositions = useSimulationStore(s => s.trainPositions)
  const getService = useSimulationStore(s => s.getService)
  const getTrainType = useSimulationStore(s => s.getTrainType)
  const reducedMotion = useSimulationStore(s => s.reducedMotion)
  
  const position = trainPositions.get(serviceId)
  const service = getService(serviceId)
  const trainType = service ? getTrainType(service.train_type_id) : null
  
  const livery = trainType 
    ? LIVERY_COLORS[trainType.livery_key] || LIVERY_COLORS['white-blue']
    : LIVERY_COLORS['white-blue']
  
  // Animate train position smoothly
  useFrame(() => {
    if (!groupRef.current || !position) return
    
    const { x, z } = latLonToScene(position.lat, position.lon)
    const targetPos = new THREE.Vector3(x, 0.45, z)
    
    if (reducedMotion) {
      groupRef.current.position.copy(targetPos)
    } else {
      groupRef.current.position.lerp(targetPos, 0.1)
    }
    
    // Rotate to face direction of travel
    const targetRotation = -position.bearing * Math.PI / 180 + Math.PI / 2
    const currentRotation = groupRef.current.rotation.y
    const diff = targetRotation - currentRotation
    
    // Normalize angle difference
    const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff))
    groupRef.current.rotation.y += normalizedDiff * (reducedMotion ? 1 : 0.1)
  })
  
  if (!position || position.status === 'waiting' || position.status === 'completed') {
    return null
  }
  
  const { x, z } = latLonToScene(position.lat, position.lon)
  
  return (
    <group
      ref={groupRef}
      position={[x, 0.45, z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Train body */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.12, 0.1]} />
        <meshStandardMaterial
          color={livery.body}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      
      {/* Stripe */}
      <mesh position={[0, -0.02, 0.051]}>
        <boxGeometry args={[0.5, 0.03, 0.001]} />
        <meshStandardMaterial
          color={livery.stripe}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      
      {/* Nose (front) */}
      <mesh position={[0.25, 0, 0]} castShadow>
        <coneGeometry args={[0.06, 0.15, 4]} />
        <meshStandardMaterial
          color={livery.nose}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      
      {/* Windows */}
      {[-0.15, 0, 0.15].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0.03, 0.051]}>
          <boxGeometry args={[0.08, 0.04, 0.001]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      ))}
      
      {/* Selection indicator */}
      {isSelected && (
        <>
          <mesh position={[0, 0.15, 0]}>
            <ringGeometry args={[0.12, 0.15, 16]} />
            <meshBasicMaterial
              color="#0ea5e9"
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Info label */}
          <Html
            position={[0, 0.35, 0]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <div
              style={{
                background: 'rgba(14, 165, 233, 0.95)',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: '1px solid #38bdf8'
              }}
            >
              {service?.name_en || serviceId}
            </div>
          </Html>
        </>
      )}
    </group>
  )
}

export function Trains() {
  const services = useSimulationStore(s => s.services)
  const selectedTrainId = useSimulationStore(s => s.selectedTrainId)
  const selectTrain = useSimulationStore(s => s.selectTrain)
  
  return (
    <group>
      {services.map(service => (
        <Train
          key={service.id}
          serviceId={service.id}
          isSelected={selectedTrainId === service.id}
          onClick={() => selectTrain(service.id)}
        />
      ))}
    </group>
  )
}
