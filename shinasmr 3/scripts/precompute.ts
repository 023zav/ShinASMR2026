import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '../src/data')

interface Station {
  id: string
  lat: number
  lon: number
}

interface Line {
  id: string
  polyline: [number, number][]
  station_ids_in_order: string[]
}

interface Segment {
  from_station_id: string
  to_station_id: string
  distance_km: number
  polyline_indices: [number, number]
  arc_length_start: number
  arc_length_end: number
}

interface DerivedRuntime {
  generated_at: string
  lines: Record<string, {
    total_length_km: number
    segments: Segment[]
  }>
}

// Haversine formula for distance between two lat/lon points
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Find the closest point on polyline to a station
function findClosestPolylineIndex(polyline: [number, number][], lat: number, lon: number): number {
  let minDist = Infinity
  let minIndex = 0
  
  for (let i = 0; i < polyline.length; i++) {
    const dist = haversineDistance(lat, lon, polyline[i][0], polyline[i][1])
    if (dist < minDist) {
      minDist = dist
      minIndex = i
    }
  }
  
  return minIndex
}

// Calculate cumulative arc length along polyline
function calculateArcLengths(polyline: [number, number][]): number[] {
  const lengths = [0]
  for (let i = 1; i < polyline.length; i++) {
    const dist = haversineDistance(
      polyline[i - 1][0], polyline[i - 1][1],
      polyline[i][0], polyline[i][1]
    )
    lengths.push(lengths[i - 1] + dist)
  }
  return lengths
}

function loadJson<T>(filename: string): T {
  const filepath = path.join(dataDir, filename)
  const content = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(content) as T
}

function precompute(): void {
  console.log('🔧 Precomputing derived runtime data...\n')

  const stations = loadJson<Station[]>('stations.json')
  const lines = loadJson<Line[]>('lines.json')

  const stationMap = new Map(stations.map(s => [s.id, s]))

  const derivedRuntime: DerivedRuntime = {
    generated_at: new Date().toISOString(),
    lines: {}
  }

  for (const line of lines) {
    console.log(`Processing line: ${line.id}`)

    const arcLengths = calculateArcLengths(line.polyline)
    const totalLength = arcLengths[arcLengths.length - 1]

    const segments: Segment[] = []

    // Map stations to polyline indices
    const stationIndices: number[] = []
    for (const stationId of line.station_ids_in_order) {
      const station = stationMap.get(stationId)
      if (!station) {
        throw new Error(`Station not found: ${stationId}`)
      }
      const idx = findClosestPolylineIndex(line.polyline, station.lat, station.lon)
      stationIndices.push(idx)
    }

    // Create segments between consecutive stations
    for (let i = 0; i < line.station_ids_in_order.length - 1; i++) {
      const fromId = line.station_ids_in_order[i]
      const toId = line.station_ids_in_order[i + 1]
      const fromIdx = stationIndices[i]
      const toIdx = stationIndices[i + 1]

      const segment: Segment = {
        from_station_id: fromId,
        to_station_id: toId,
        distance_km: arcLengths[toIdx] - arcLengths[fromIdx],
        polyline_indices: [fromIdx, toIdx],
        arc_length_start: arcLengths[fromIdx],
        arc_length_end: arcLengths[toIdx]
      }

      segments.push(segment)
      console.log(`  ${fromId} → ${toId}: ${segment.distance_km.toFixed(1)} km`)
    }

    derivedRuntime.lines[line.id] = {
      total_length_km: totalLength,
      segments
    }

    console.log(`  Total line length: ${totalLength.toFixed(1)} km\n`)
  }

  // Write output
  const outputPath = path.join(dataDir, 'derived-runtime.json')
  fs.writeFileSync(outputPath, JSON.stringify(derivedRuntime, null, 2))
  console.log(`✅ Written to ${outputPath}`)
}

precompute()
