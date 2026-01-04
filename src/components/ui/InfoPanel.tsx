import { useTranslation } from 'react-i18next'
import { useSimulationStore } from '@/store'
import { formatTime, formatSpeed, formatProgress } from '@/utils/format'
import styles from './InfoPanel.module.css'

export function InfoPanel() {
  const { t } = useTranslation()
  
  const selectedTrainId = useSimulationStore(s => s.selectedTrainId)
  const selectedStationId = useSimulationStore(s => s.selectedStationId)
  const trainPositions = useSimulationStore(s => s.trainPositions)
  const followingTrainId = useSimulationStore(s => s.followingTrainId)
  
  const getService = useSimulationStore(s => s.getService)
  const getTrainType = useSimulationStore(s => s.getTrainType)
  const getStation = useSimulationStore(s => s.getStation)
  const getLine = useSimulationStore(s => s.getLine)
  
  const selectTrain = useSimulationStore(s => s.selectTrain)
  const selectStation = useSimulationStore(s => s.selectStation)
  const followTrain = useSimulationStore(s => s.followTrain)
  
  // Render train info
  if (selectedTrainId) {
    const service = getService(selectedTrainId)
    const position = trainPositions.get(selectedTrainId)
    const trainType = service ? getTrainType(service.train_type_id) : null
    const line = service ? getLine(service.line_id) : null
    const nextStation = position?.nextStopId ? getStation(position.nextStopId) : null
    
    if (!service) return null
    
    const statusText = {
      waiting: t('train.status.waiting'),
      running: t('train.status.running'),
      stopped: t('train.status.stopped'),
      completed: t('train.status.completed')
    }[position?.status || 'waiting']
    
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3 className={styles.title}>{service.name_en}</h3>
          <button
            className={styles.closeButton}
            onClick={() => selectTrain(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.label}>{t('train.type')}</span>
            <span className={styles.value}>{trainType?.name_en || '-'}</span>
          </div>
          
          <div className={styles.row}>
            <span className={styles.label}>{t('train.route')}</span>
            <span className={styles.value}>{line?.name_en || '-'}</span>
          </div>
          
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <span className={`${styles.value} ${styles.status}`} data-status={position?.status}>
              {statusText}
            </span>
          </div>
          
          {position?.status === 'running' && (
            <>
              <div className={styles.row}>
                <span className={styles.label}>{t('train.nextStop')}</span>
                <span className={styles.value}>{nextStation?.name_en || '-'}</span>
              </div>
              
              <div className={styles.row}>
                <span className={styles.label}>{t('train.speed')}</span>
                <span className={`${styles.value} ${styles.mono}`}>
                  {formatSpeed(position.speed)}
                </span>
              </div>
              
              <div className={styles.row}>
                <span className={styles.label}>{t('train.progress')}</span>
                <span className={`${styles.value} ${styles.mono}`}>
                  {formatProgress(position.totalProgress)}
                </span>
              </div>
            </>
          )}
          
          {trainType && trainType.facts_en.length > 0 && (
            <div className={styles.facts}>
              <span className={styles.factsLabel}>Did you know?</span>
              <p className={styles.fact}>{trainType.facts_en[0]}</p>
            </div>
          )}
        </div>
        
        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${followingTrainId === selectedTrainId ? styles.active : ''}`}
            onClick={() => followTrain(followingTrainId === selectedTrainId ? null : selectedTrainId)}
          >
            {followingTrainId === selectedTrainId ? t('camera.exit') : t('camera.follow')}
          </button>
        </div>
      </div>
    )
  }
  
  // Render station info
  if (selectedStationId) {
    const station = getStation(selectedStationId)
    
    if (!station) return null
    
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3 className={styles.title}>{station.name_en}</h3>
          <button
            className={styles.closeButton}
            onClick={() => selectStation(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          {station.name_ja && (
            <div className={styles.row}>
              <span className={styles.label}>Japanese</span>
              <span className={styles.value}>{station.name_ja}</span>
            </div>
          )}
          
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
          
          {station.metadata?.daily_passengers && (
            <div className={styles.row}>
              <span className={styles.label}>Daily Passengers</span>
              <span className={styles.value}>
                ~{(station.metadata.daily_passengers / 1000).toFixed(0)}k
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // Empty state
  return (
    <div className={`${styles.panel} ${styles.empty}`}>
      <p className={styles.emptyText}>{t('misc.noSelection')}</p>
    </div>
  )
}
