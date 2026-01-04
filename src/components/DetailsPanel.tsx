import { useTranslation } from 'react-i18next'
import { useSimulationStore } from '@/store'
import { formatTime, formatSpeed, formatProgress } from '@/utils'
import styles from './DetailsPanel.module.css'

export function DetailsPanel() {
  const { t } = useTranslation()
  
  const selectedTrainId = useSimulationStore(s => s.selectedTrainId)
  const selectedStationId = useSimulationStore(s => s.selectedStationId)
  const trainPositions = useSimulationStore(s => s.trainPositions)
  const followingTrainId = useSimulationStore(s => s.followingTrainId)
  
  const getService = useSimulationStore(s => s.getService)
  const getTrainType = useSimulationStore(s => s.getTrainType)
  const getStation = useSimulationStore(s => s.getStation)
  const selectTrain = useSimulationStore(s => s.selectTrain)
  const selectStation = useSimulationStore(s => s.selectStation)
  const followTrain = useSimulationStore(s => s.followTrain)
  
  // Train details
  if (selectedTrainId) {
    const service = getService(selectedTrainId)
    const trainType = service ? getTrainType(service.train_type_id) : null
    const position = trainPositions.get(selectedTrainId)
    const nextStop = position?.nextStopId ? getStation(position.nextStopId) : null
    
    if (!service) return null
    
    const statusKey = position?.status === 'running' 
      ? 'train.status.running'
      : position?.status === 'stopped'
      ? 'train.status.stopped'
      : position?.status === 'completed'
      ? 'train.status.completed'
      : 'train.status.waiting'
    
    return (
      <div className={styles.container}>
        <div className={styles.panel}>
          <button
            className={styles.closeButton}
            onClick={() => selectTrain(null)}
            aria-label="Close"
          >
            ×
          </button>
          
          <div className={styles.header}>
            <h2 className={styles.title}>{service.name_en}</h2>
            <span className={`${styles.status} ${styles[position?.status || 'waiting']}`}>
              {t(statusKey)}
            </span>
          </div>
          
          <div className={styles.grid}>
            <div className={styles.row}>
              <span className={styles.label}>{t('train.type')}</span>
              <span className={styles.value}>{trainType?.name_en || '—'}</span>
            </div>
            
            <div className={styles.row}>
              <span className={styles.label}>{t('train.route')}</span>
              <span className={styles.value}>
                {service.stops[0].station_id} → {service.stops[service.stops.length - 1].station_id}
              </span>
            </div>
            
            <div className={styles.row}>
              <span className={styles.label}>{t('train.nextStop')}</span>
              <span className={styles.value}>{nextStop?.name_en || '—'}</span>
            </div>
            
            <div className={styles.row}>
              <span className={styles.label}>{t('train.speed')}</span>
              <span className={styles.value}>{formatSpeed(position?.speed || 0)}</span>
            </div>
            
            <div className={styles.row}>
              <span className={styles.label}>{t('train.progress')}</span>
              <span className={styles.value}>{formatProgress(position?.totalProgress || 0)}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar}
              style={{ width: `${(position?.totalProgress || 0) * 100}%` }}
            />
          </div>
          
          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={`${styles.actionButton} ${followingTrainId === selectedTrainId ? styles.following : ''}`}
              onClick={() => followTrain(followingTrainId === selectedTrainId ? null : selectedTrainId)}
            >
              {followingTrainId === selectedTrainId ? t('camera.exit') : t('camera.follow')}
            </button>
          </div>
          
          {/* Fun fact */}
          {trainType && trainType.facts_en.length > 0 && (
            <div className={styles.fact}>
              <span className={styles.factLabel}>💡</span>
              <span className={styles.factText}>
                {trainType.facts_en[Math.floor(Math.random() * trainType.facts_en.length)]}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // Station details
  if (selectedStationId) {
    const station = getStation(selectedStationId)
    if (!station) return null
    
    return (
      <div className={styles.container}>
        <div className={styles.panel}>
          <button
            className={styles.closeButton}
            onClick={() => selectStation(null)}
            aria-label="Close"
          >
            ×
          </button>
          
          <div className={styles.header}>
            <h2 className={styles.title}>{station.name_en}</h2>
            {station.name_ja && (
              <span className={styles.subtitle}>{station.name_ja}</span>
            )}
          </div>
          
          <div className={styles.grid}>
            {station.metadata?.platforms && (
              <div className={styles.row}>
                <span className={styles.label}>{t('station.platforms')}</span>
                <span className={styles.value}>{station.metadata.platforms}</span>
              </div>
            )}
            
            {station.metadata?.opened_year && (
              <div className={styles.row}>
                <span className={styles.label}>Opened</span>
                <span className={styles.value}>{station.metadata.opened_year}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // No selection - show hint
  return (
    <div className={styles.container}>
      <div className={`${styles.panel} ${styles.hint}`}>
        <span className={styles.hintText}>{t('misc.noSelection')}</span>
      </div>
    </div>
  )
}
