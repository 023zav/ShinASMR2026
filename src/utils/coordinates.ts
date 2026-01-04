// Japan bounds (approximate)
export const JAPAN_BOUNDS = {
  minLat: 31.0,
  maxLat: 45.5,
  minLon: 129.0,
  maxLon: 145.0,
  centerLat: 36.5,
  centerLon: 138.0
}

// Scene scale (1 unit = ~10km for nice proportions)
export const SCENE_SCALE = 0.1

// Convert lat/lon to scene coordinates
// Uses a simple equirectangular projection centered on Japan
export function latLonToScene(lat: number, lon: number): { x: number; z: number } {
  // Approximate km per degree at Japan's latitude
  const kmPerDegLat = 111.0
  const kmPerDegLon = 111.0 * Math.cos(JAPAN_BOUNDS.centerLat * Math.PI / 180)
  
  // Distance from center in km
  const dLat = lat - JAPAN_BOUNDS.centerLat
  const dLon = lon - JAPAN_BOUNDS.centerLon
  
  const kmX = dLon * kmPerDegLon
  const kmZ = dLat * kmPerDegLat
  
  // Apply scale
  return {
    x: kmX * SCENE_SCALE,
    z: -kmZ * SCENE_SCALE // Negative because z increases southward in Three.js
  }
}

// Convert scene coordinates back to lat/lon
export function sceneToLatLon(x: number, z: number): { lat: number; lon: number } {
  const kmPerDegLat = 111.0
  const kmPerDegLon = 111.0 * Math.cos(JAPAN_BOUNDS.centerLat * Math.PI / 180)
  
  const kmX = x / SCENE_SCALE
  const kmZ = -z / SCENE_SCALE
  
  const lat = JAPAN_BOUNDS.centerLat + kmZ / kmPerDegLat
  const lon = JAPAN_BOUNDS.centerLon + kmX / kmPerDegLon
  
  return { lat, lon }
}

// Isometric camera angle (standard 35.264° for true isometric)
export const ISO_ANGLE = Math.atan(1 / Math.sqrt(2)) // ~35.264°

// Camera position for isometric view
export function getIsometricCameraPosition(
  targetX: number,
  targetZ: number,
  distance: number
): { x: number; y: number; z: number } {
  // Isometric view: camera looks down at 35° from horizontal, rotated 45° around Y
  const rotation = Math.PI / 4 // 45 degrees
  
  return {
    x: targetX + distance * Math.sin(rotation) * Math.cos(ISO_ANGLE),
    y: distance * Math.sin(ISO_ANGLE),
    z: targetZ + distance * Math.cos(rotation) * Math.cos(ISO_ANGLE)
  }
}

// Convert polyline to scene coordinates
export function polylineToScene(polyline: [number, number][]): { x: number; z: number }[] {
  return polyline.map(([lat, lon]) => latLonToScene(lat, lon))
}

// Calculate bounds of scene coordinates
export function getSceneBounds(points: { x: number; z: number }[]): {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  centerX: number
  centerZ: number
  width: number
  height: number
} {
  let minX = Infinity, maxX = -Infinity
  let minZ = Infinity, maxZ = -Infinity
  
  for (const p of points) {
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
    minZ = Math.min(minZ, p.z)
    maxZ = Math.max(maxZ, p.z)
  }
  
  return {
    minX,
    maxX,
    minZ,
    maxZ,
    centerX: (minX + maxX) / 2,
    centerZ: (minZ + maxZ) / 2,
    width: maxX - minX,
    height: maxZ - minZ
  }
}
