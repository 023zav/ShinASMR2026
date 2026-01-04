import { create } from 'zustand'
import type { Station, Line, TrainType, Service } from '@/data/schemas'

// Import data
import stationsData from '@/data/stations.json'
import linesData from '@/data/lines.json'
import trainTypesData from '@/data/train-types.json'
import servicesData from '@/data/services.json'

export type SimulationSpeed = 1 | 10 | 60

export interface TrainPosition {
  serviceId: string
  lat: number
  lon: number
  bearing: number // degrees
  progress: number // 0-1 along current segment
  totalProgress: number // 0-1 along entire route
  currentSegmentIndex: number
  speed: number // km/h
  status: 'waiting' | 'running' | 'stopped' | 'completed'
  nextStopId: string | null
}

export interface SimulationState {
  // Time
  simulationTime: number // minutes since midnight
  isPlaying: boolean
  speed: SimulationSpeed
  
  // Data
  stations: Station[]
  lines: Line[]
  trainTypes: TrainType[]
  services: Service[]
  
  // Computed positions
  trainPositions: Map<string, TrainPosition>
  
  // Selection
  selectedTrainId: string | null
  selectedStationId: string | null
  
  // Camera
  followingTrainId: string | null
  
  // Audio
  audioEnabled: boolean
  audioVolume: number
  
  // UI
  isAboutOpen: boolean
  isSupportOpen: boolean
  reducedMotion: boolean
  
  // Actions
  setSimulationTime: (time: number) => void
  setIsPlaying: (playing: boolean) => void
  setSpeed: (speed: SimulationSpeed) => void
  tick: (deltaMs: number) => void
  
  selectTrain: (id: string | null) => void
  selectStation: (id: string | null) => void
  followTrain: (id: string | null) => void
  
  setAudioEnabled: (enabled: boolean) => void
  setAudioVolume: (volume: number) => void
  
  setAboutOpen: (open: boolean) => void
  setSupportOpen: (open: boolean) => void
  setReducedMotion: (reduced: boolean) => void
  
  // Helpers
  getStation: (id: string) => Station | undefined
  getLine: (id: string) => Line | undefined
  getTrainType: (id: string) => TrainType | undefined
  getService: (id: string) => Service | undefined
}

// Helper to parse HH:MM to minutes since midnight
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// Helper to interpolate position along polyline
function interpolatePolyline(
  polyline: [number, number][],
  progress: number
): { lat: number; lon: number; bearing: number } {
  const totalSegments = polyline.length - 1
  const exactIndex = progress * totalSegments
  const segmentIndex = Math.min(Math.floor(exactIndex), totalSegments - 1)
  const segmentProgress = exactIndex - segmentIndex
  
  const p1 = polyline[segmentIndex]
  const p2 = polyline[Math.min(segmentIndex + 1, polyline.length - 1)]
  
  const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress
  const lon = p1[1] + (p2[1] - p1[1]) * segmentProgress
  
  // Calculate bearing
  const dLon = (p2[1] - p1[1]) * Math.PI / 180
  const lat1 = p1[0] * Math.PI / 180
  const lat2 = p2[0] * Math.PI / 180
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
  
  return { lat, lon, bearing }
}

// Calculate train positions based on current simulation time
function calculateTrainPositions(
  services: Service[],
  lines: Line[],
  simulationTime: number
): Map<string, TrainPosition> {
  const positions = new Map<string, TrainPosition>()
  const lineMap = new Map(lines.map(l => [l.id, l]))
  
  for (const service of services) {
    const line = lineMap.get(service.line_id)
    if (!line) continue
    
    const stops = service.stops
    const firstDeparture = parseTime(stops[0].departure)
    const lastArrival = parseTime(stops[stops.length - 1].arrival)
    
    // Determine status
    let status: TrainPosition['status'] = 'waiting'
    let progress = 0
    let currentSegmentIndex = 0
    let nextStopId: string | null = stops[0].station_id
    let speed = 0
    
    if (simulationTime < firstDeparture) {
      status = 'waiting'
      progress = 0
    } else if (simulationTime >= lastArrival) {
      status = 'completed'
      progress = 1
      currentSegmentIndex = stops.length - 2
      nextStopId = null
    } else {
      // Find current segment
      for (let i = 0; i < stops.length - 1; i++) {
        const stopDeparture = parseTime(stops[i].departure)
        const nextArrival = parseTime(stops[i + 1].arrival)
        const nextDeparture = parseTime(stops[i + 1].departure)
        
        if (simulationTime >= stopDeparture && simulationTime < nextArrival) {
          // In transit between stations
          status = 'running'
          currentSegmentIndex = i
          nextStopId = stops[i + 1].station_id
          
          const segmentDuration = nextArrival - stopDeparture
          const elapsed = simulationTime - stopDeparture
          const segmentProgress = Math.min(elapsed / segmentDuration, 1)
          
          // Apply ease-in/ease-out for acceleration/deceleration
          const eased = segmentProgress < 0.5
            ? 2 * segmentProgress * segmentProgress
            : 1 - Math.pow(-2 * segmentProgress + 2, 2) / 2
          
          // Calculate total progress along route
          const stopsCompleted = i
          const totalStops = stops.length - 1
          progress = (stopsCompleted + eased) / totalStops
          
          // Estimate speed based on segment
          const segmentDistanceKm = 50 // Approximate, would be more accurate with real data
          speed = (segmentDistanceKm / (segmentDuration / 60)) * (1 - Math.abs(eased - 0.5) * 0.4)
          
          break
        } else if (simulationTime >= nextArrival && simulationTime < nextDeparture) {
          // Stopped at station
          status = 'stopped'
          currentSegmentIndex = i
          nextStopId = stops[i + 1].station_id
          progress = (i + 1) / (stops.length - 1)
          speed = 0
          break
        }
      }
    }
    
    // Get position on polyline
    // For 'up' direction, reverse the progress
    const effectiveProgress = service.direction === 'up' ? 1 - progress : progress
    const { lat, lon, bearing } = interpolatePolyline(line.polyline, effectiveProgress)
    
    positions.set(service.id, {
      serviceId: service.id,
      lat,
      lon,
      bearing: service.direction === 'up' ? (bearing + 180) % 360 : bearing,
      progress: effectiveProgress,
      totalProgress: progress,
      currentSegmentIndex,
      speed: Math.round(speed),
      status,
      nextStopId
    })
  }
  
  return positions
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // Initial state - start at 6:00 AM for interesting train activity
  simulationTime: 360, // 6:00 AM
  isPlaying: true,
  speed: 10,
  
  stations: stationsData as Station[],
  lines: linesData as Line[],
  trainTypes: trainTypesData as TrainType[],
  services: servicesData as Service[],
  
  trainPositions: calculateTrainPositions(
    servicesData as Service[],
    linesData as Line[],
    360
  ),
  
  selectedTrainId: null,
  selectedStationId: null,
  followingTrainId: null,
  
  audioEnabled: false,
  audioVolume: 0.5,
  
  isAboutOpen: false,
  isSupportOpen: false,
  reducedMotion: false,
  
  // Actions
  setSimulationTime: (time) => {
    const { services, lines } = get()
    const positions = calculateTrainPositions(services, lines, time)
    set({ simulationTime: time, trainPositions: positions })
  },
  
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  setSpeed: (speed) => set({ speed }),
  
  tick: (deltaMs) => {
    const { isPlaying, speed, simulationTime, services, lines } = get()
    if (!isPlaying) return
    
    // Convert delta to simulation minutes
    const deltaMinutes = (deltaMs / 1000 / 60) * speed
    let newTime = simulationTime + deltaMinutes
    
    // Wrap around at midnight (1440 minutes)
    if (newTime >= 1440) {
      newTime = newTime % 1440
    }
    
    const positions = calculateTrainPositions(services, lines, newTime)
    set({ simulationTime: newTime, trainPositions: positions })
  },
  
  selectTrain: (id) => set({ selectedTrainId: id, selectedStationId: null }),
  selectStation: (id) => set({ selectedStationId: id, selectedTrainId: null }),
  followTrain: (id) => set({ followingTrainId: id }),
  
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  setAudioVolume: (volume) => set({ audioVolume: volume }),
  
  setAboutOpen: (open) => set({ isAboutOpen: open }),
  setSupportOpen: (open) => set({ isSupportOpen: open }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  
  // Helpers
  getStation: (id) => get().stations.find(s => s.id === id),
  getLine: (id) => get().lines.find(l => l.id === id),
  getTrainType: (id) => get().trainTypes.find(t => t.id === id),
  getService: (id) => get().services.find(s => s.id === id),
}))
