import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '../src/data')

// Import schemas inline to avoid module resolution issues
const StationSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_ja: z.string().optional(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  line_ids: z.array(z.string()),
  metadata: z.object({
    opened_year: z.number().optional(),
    platforms: z.number().optional(),
    daily_passengers: z.number().optional()
  }).optional()
})

const LineSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_ja: z.string().optional(),
  color: z.string(),
  polyline: z.array(z.tuple([z.number(), z.number()])),
  station_ids_in_order: z.array(z.string())
})

const TrainTypeSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_ja: z.string().optional(),
  max_speed_kmh: z.number().positive(),
  length_m: z.number().positive(),
  cars: z.number().positive(),
  livery_key: z.string(),
  facts_en: z.array(z.string())
})

const ServiceStopSchema = z.object({
  station_id: z.string(),
  arrival: z.string().regex(/^\d{2}:\d{2}$/),
  departure: z.string().regex(/^\d{2}:\d{2}$/)
})

const ServiceSchema = z.object({
  id: z.string(),
  line_id: z.string(),
  train_type_id: z.string(),
  name_en: z.string(),
  direction: z.enum(['up', 'down']),
  stops: z.array(ServiceStopSchema).min(2)
})

function loadJson(filename: string): unknown {
  const filepath = path.join(dataDir, filename)
  const content = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(content)
}

function validateData(): boolean {
  console.log('🔍 Validating data files...\n')
  let hasErrors = false

  // Validate stations
  try {
    const stations = z.array(StationSchema).parse(loadJson('stations.json'))
    console.log(`✅ stations.json: ${stations.length} stations valid`)
  } catch (e) {
    console.error('❌ stations.json validation failed:', e)
    hasErrors = true
  }

  // Validate lines
  try {
    const lines = z.array(LineSchema).parse(loadJson('lines.json'))
    console.log(`✅ lines.json: ${lines.length} lines valid`)
  } catch (e) {
    console.error('❌ lines.json validation failed:', e)
    hasErrors = true
  }

  // Validate train types
  try {
    const trainTypes = z.array(TrainTypeSchema).parse(loadJson('train-types.json'))
    console.log(`✅ train-types.json: ${trainTypes.length} train types valid`)
  } catch (e) {
    console.error('❌ train-types.json validation failed:', e)
    hasErrors = true
  }

  // Validate services
  try {
    const services = z.array(ServiceSchema).parse(loadJson('services.json'))
    console.log(`✅ services.json: ${services.length} services valid`)
  } catch (e) {
    console.error('❌ services.json validation failed:', e)
    hasErrors = true
  }

  // Cross-reference validation
  if (!hasErrors) {
    console.log('\n🔗 Cross-reference validation...')
    
    const stations = z.array(StationSchema).parse(loadJson('stations.json'))
    const lines = z.array(LineSchema).parse(loadJson('lines.json'))
    const trainTypes = z.array(TrainTypeSchema).parse(loadJson('train-types.json'))
    const services = z.array(ServiceSchema).parse(loadJson('services.json'))

    const stationIds = new Set(stations.map(s => s.id))
    const lineIds = new Set(lines.map(l => l.id))
    const trainTypeIds = new Set(trainTypes.map(t => t.id))

    // Check line station references
    for (const line of lines) {
      for (const stationId of line.station_ids_in_order) {
        if (!stationIds.has(stationId)) {
          console.error(`❌ Line "${line.id}" references unknown station: ${stationId}`)
          hasErrors = true
        }
      }
    }

    // Check service references
    for (const service of services) {
      if (!lineIds.has(service.line_id)) {
        console.error(`❌ Service "${service.id}" references unknown line: ${service.line_id}`)
        hasErrors = true
      }
      if (!trainTypeIds.has(service.train_type_id)) {
        console.error(`❌ Service "${service.id}" references unknown train type: ${service.train_type_id}`)
        hasErrors = true
      }
      for (const stop of service.stops) {
        if (!stationIds.has(stop.station_id)) {
          console.error(`❌ Service "${service.id}" references unknown station: ${stop.station_id}`)
          hasErrors = true
        }
      }
    }

    if (!hasErrors) {
      console.log('✅ All cross-references valid')
    }
  }

  console.log('')
  if (hasErrors) {
    console.log('❌ Validation failed')
    process.exit(1)
  } else {
    console.log('✅ All validations passed!')
  }

  return !hasErrors
}

validateData()
