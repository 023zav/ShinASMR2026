import { useRef, useCallback, useEffect } from 'react'
import { Howl, Howler } from 'howler'
import { useSimulationStore } from '@/store'

// Audio URLs - using placeholder data URIs for MVP
// In production, these would be real audio files
const AMBIENT_LOOP = '/audio/ambient.mp3'
const TRAIN_PASS = '/audio/train-pass.mp3'

export function useAudio() {
  const ambientRef = useRef<Howl | null>(null)
  const trainPassRef = useRef<Howl | null>(null)
  const initializedRef = useRef(false)
  
  const audioEnabled = useSimulationStore(s => s.audioEnabled)
  const audioVolume = useSimulationStore(s => s.audioVolume)
  
  const initAudio = useCallback(() => {
    if (initializedRef.current) return
    
    // Create ambient loop
    ambientRef.current = new Howl({
      src: [AMBIENT_LOOP],
      loop: true,
      volume: audioVolume * 0.3,
      html5: true, // Use HTML5 audio for better mobile support
      onloaderror: () => {
        // Gracefully handle missing audio files in MVP
        console.warn('Ambient audio not found, continuing without audio')
      }
    })
    
    // Create train pass sound
    trainPassRef.current = new Howl({
      src: [TRAIN_PASS],
      loop: false,
      volume: audioVolume * 0.5,
      html5: true,
      onloaderror: () => {
        console.warn('Train pass audio not found, continuing without audio')
      }
    })
    
    // Start ambient after user gesture
    ambientRef.current.play()
    
    initializedRef.current = true
  }, [audioVolume])
  
  const setVolume = useCallback((volume: number) => {
    Howler.volume(volume)
    
    if (ambientRef.current) {
      ambientRef.current.volume(volume * 0.3)
    }
    if (trainPassRef.current) {
      trainPassRef.current.volume(volume * 0.5)
    }
  }, [])
  
  const playTrainPass = useCallback(() => {
    if (trainPassRef.current && audioEnabled) {
      trainPassRef.current.play()
    }
  }, [audioEnabled])
  
  const stopAll = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.stop()
    }
    if (trainPassRef.current) {
      trainPassRef.current.stop()
    }
  }, [])
  
  // Handle audio enabled/disabled state
  useEffect(() => {
    if (!initializedRef.current) return
    
    if (audioEnabled) {
      ambientRef.current?.play()
    } else {
      ambientRef.current?.pause()
    }
  }, [audioEnabled])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll()
    }
  }, [stopAll])
  
  return {
    initAudio,
    setVolume,
    playTrainPass,
    stopAll
  }
}
