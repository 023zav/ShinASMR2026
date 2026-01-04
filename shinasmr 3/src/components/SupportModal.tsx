import { useTranslation } from 'react-i18next'
import { useSimulationStore } from '@/store'
import styles from './Modal.module.css'

// Ko-fi or other donation link
const SUPPORT_URL = 'https://ko-fi.com/shinasmr'

export function SupportModal() {
  const { t } = useTranslation()
  
  const isOpen = useSimulationStore(s => s.isSupportOpen)
  const setOpen = useSimulationStore(s => s.setSupportOpen)
  
  if (!isOpen) return null
  
  const handleSupport = () => {
    window.open(SUPPORT_URL, '_blank', 'noopener,noreferrer')
  }
  
  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={() => setOpen(false)}
          aria-label={t('about.close')}
        >
          ×
        </button>
        
        <div className={styles.supportIcon}>❤️</div>
        
        <h2 className={styles.title}>{t('support.title')}</h2>
        
        <p className={styles.description}>
          {t('support.text')}
        </p>
        
        <div className={styles.footer}>
          <button
            className={styles.supportButton}
            onClick={handleSupport}
          >
            ☕ {t('support.button')}
          </button>
          
          <button
            className={styles.secondaryButton}
            onClick={() => setOpen(false)}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
