import { useCallback } from 'react'
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
  
  const { initAudio, setVolume } = useAudio()
  
  const handleEnableSound = useCallback(() => {
    initAudio()
    setAudioEnabled(true)
  }, [initAudio, setAudioEnabled])
  
  const handleToggleMute = useCallback(() => {
    if (audioEnabled) {
      setAudioEnabled(false)
    } else {
      handleEnableSound()
    }
  }, [audioEnabled, setAudioEnabled, handleEnableSound])
  
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(e.target.value)
    setAudioVolume(volume)
    setVolume(volume)
  }, [setAudioVolume, setVolume])
  
  return (
    <div className={styles.container}>
      {!audioEnabled ? (
        <button
          className={styles.enableButton}
          onClick={handleEnableSound}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <span>{t('audio.enable')}</span>
        </button>
      ) : (
        <div className={styles.controls}>
          <button
            className={styles.muteButton}
            onClick={handleToggleMute}
            aria-label={audioEnabled ? t('audio.mute') : t('audio.unmute')}
          >
            {audioVolume > 0 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
          
          <input
            type="range"
            className={styles.volumeSlider}
            min={0}
            max={1}
            step={0.01}
            value={audioVolume}
            onChange={handleVolumeChange}
            aria-label={t('audio.volume')}
          />
        </div>
      )}
    </div>
  )
}
