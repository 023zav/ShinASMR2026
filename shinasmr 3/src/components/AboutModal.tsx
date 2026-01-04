import { useTranslation } from 'react-i18next'
import { useSimulationStore } from '@/store'
import styles from './Modal.module.css'

export function AboutModal() {
  const { t } = useTranslation()
  
  const isOpen = useSimulationStore(s => s.isAboutOpen)
  const setOpen = useSimulationStore(s => s.setAboutOpen)
  
  if (!isOpen) return null
  
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
        
        <h2 className={styles.title}>{t('about.title')}</h2>
        
        <p className={styles.description}>
          {t('about.description')}
        </p>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('about.attribution')}</h3>
          <ul className={styles.list}>
            <li>{t('about.osmNote')}</li>
            <li className={styles.muted}>{t('about.osmCopyright')}</li>
            <li>{t('about.simulatedNote')}</li>
          </ul>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('about.disclaimer')}</h3>
          <p className={styles.disclaimer}>
            {t('about.disclaimerText')}
          </p>
        </div>
        
        <div className={styles.footer}>
          <button
            className={styles.primaryButton}
            onClick={() => setOpen(false)}
          >
            {t('about.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
