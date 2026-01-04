import { useTranslation } from 'react-i18next'
import { useSimulationStore, SimulationSpeed } from '@/store'
import { formatTime } from '@/utils'
import styles from './TimeControls.module.css'

export function TimeControls() {
  const { t } = useTranslation()
  
  const simulationTime = useSimulationStore(s => s.simulationTime)
  const isPlaying = useSimulationStore(s => s.isPlaying)
  const speed = useSimulationStore(s => s.speed)
  const setIsPlaying = useSimulationStore(s => s.setIsPlaying)
  const setSpeed = useSimulationStore(s => s.setSpeed)
  const setSimulationTime = useSimulationStore(s => s.setSimulationTime)
  
  const speeds: SimulationSpeed[] = [1, 10, 60]
  
  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        {/* Play/Pause */}
        <button
          className={styles.playButton}
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? t('controls.pause') : t('controls.play')}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        
        {/* Speed selector */}
        <div className={styles.speedButtons}>
          {speeds.map(s => (
            <button
              key={s}
              className={`${styles.speedButton} ${speed === s ? styles.active : ''}`}
              onClick={() => setSpeed(s)}
              aria-label={`${s}x speed`}
            >
              {s}x
            </button>
          ))}
        </div>
        
        {/* Time display */}
        <div className={styles.timeDisplay}>
          <span className={styles.timeLabel}>{formatTime(simulationTime)}</span>
        </div>
        
        {/* Time scrubber */}
        <input
          type="range"
          className={styles.scrubber}
          min={0}
          max={1440}
          value={simulationTime}
          onChange={(e) => setSimulationTime(Number(e.target.value))}
          aria-label={t('controls.time')}
        />
      </div>
    </div>
  )
}
