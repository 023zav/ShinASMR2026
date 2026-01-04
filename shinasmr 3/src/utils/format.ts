// Format minutes since midnight to HH:MM
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24
  const mins = Math.floor(minutes % 60)
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

// Parse HH:MM to minutes since midnight
export function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// Format speed with units
export function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`
}

// Format distance with units
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }
  return `${km.toFixed(1)} km`
}

// Format percentage
export function formatProgress(progress: number): string {
  return `${Math.round(progress * 100)}%`
}
