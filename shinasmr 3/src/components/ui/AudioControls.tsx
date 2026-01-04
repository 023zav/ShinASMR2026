import { useTranslation } from 'react-i18next'
import { useSimulationStore } from '@/store'
import { useAudio } from '@/hooks/useAudio'
import styles from './AudioControls.module.css'

export function AudioControls() {
  const { t } = useTranslation()
  
  const audioEnabled = useSimulationStore(s => s.audioEnabled)
  const audioVolume = useSimulationStore(s => s.audioVolume)
  const setAudioEnabled = useSimulationStore(s => s.setAudioEnabled)
  const setAudioVolume = useSimulationStore(s => s.setAudioVolume)
  
  const { initAudio } = useAudio()
  
  const handleEnableAudio = async () => {
    await initAudio()
    setAudioEnabled(true)
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioVolume(Number(e.target.value))
  }
  
  const handleMuteToggle = () => {
    setAudioEnabled(!audioEnabled)
  }
  
  if (!audioEnabled) {
    return (
      <button
        className={styles.enableButton}
        onClick={handleEnableAudio}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
        <span>{t('audio.enable')}</span>
      </button>
    )
  }
  
  return (
    <div className={styles.controls}>
      <button
        className={styles.muteButton}
        onClick={handleMuteToggle}
        aria-label={audioEnabled ? t('audio.mute') : t('audio.unmute')}
      >
        {audioVolume === 0 ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
      
      <input
        type="range"
        className={styles.volumeSlider}
        min={0}
        max={1}
        step={0.1}
        value={audioVolume}
        onChange={handleVolumeChange}
        aria-label={t('audio.volume')}
      />
    </div>
  )
}
