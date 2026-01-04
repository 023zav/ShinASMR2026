import { z } from 'zod'

// Station schema
export const StationSchema = z.object({
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

export type Station = z.infer<typeof StationSchema>

// Line schema
export const LineSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_ja: z.string().optional(),
  color: z.string(), // hex color
  polyline: z.array(z.tuple([z.number(), z.number()])), // [lat, lon] pairs
  station_ids_in_order: z.array(z.string())
})

export type Line = z.infer<typeof LineSchema>

// Train type schema
export const TrainTypeSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_ja: z.string().optional(),
  max_speed_kmh: z.number().positive(),
  length_m: z.number().positive(),
  cars: z.number().positive(),
  livery_key: z.string(), // maps to color scheme
  facts_en: z.array(z.string())
})

export type TrainType = z.infer<typeof TrainTypeSchema>

// Service stop schema
export const ServiceStopSchema = z.object({
  station_id: z.string(),
  arrival: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
  departure: z.string().regex(/^\d{2}:\d{2}$/)
})

export type ServiceStop = z.infer<typeof ServiceStopSchema>

// Service schema
export const ServiceSchema = z.object({
  id: z.string(),
  line_id: z.string(),
  train_type_id: z.string(),
  name_en: z.string(),
  direction: z.enum(['up', 'down']), // up = towards Tokyo, down = away from Tokyo
  stops: z.array(ServiceStopSchema).min(2)
})

export type Service = z.infer<typeof ServiceSchema>

// Derived runtime data schema
export const SegmentSchema = z.object({
  from_station_id: z.string(),
  to_station_id: z.string(),
  distance_km: z.number(),
  polyline_indices: z.tuple([z.number(), z.number()]), // start, end indices in line polyline
  arc_length_start: z.number(), // cumulative distance from line start
  arc_length_end: z.number()
})

export type Segment = z.infer<typeof SegmentSchema>

export const DerivedRuntimeSchema = z.object({
  generated_at: z.string(),
  lines: z.record(z.object({
    total_length_km: z.number(),
    segments: z.array(SegmentSchema)
  }))
})

export type DerivedRuntime = z.infer<typeof DerivedRuntimeSchema>

// Full data collection schemas
export const StationsFileSchema = z.array(StationSchema)
export const LinesFileSchema = z.array(LineSchema)
export const TrainTypesFileSchema = z.array(TrainTypeSchema)
export const ServicesFileSchema = z.array(ServiceSchema)
