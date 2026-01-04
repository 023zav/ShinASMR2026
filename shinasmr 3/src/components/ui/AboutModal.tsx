import { useTranslation } from 'react-i18next'
import { useSimulationStore } from '@/store'
import styles from './AboutModal.module.css'

export function AboutModal() {
  const { t } = useTranslation()
  
  const isOpen = useSimulationStore(s => s.isAboutOpen)
  const setOpen = useSimulationStore(s => s.setAboutOpen)
  
  if (!isOpen) return null
  
  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('about.title')}</h2>
          <button
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label={t('about.close')}
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.description}>
            {t('about.description')}
          </p>
          
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('about.attribution')}</h3>
            <ul className={styles.list}>
              <li>
                {t('about.osmNote')}
                <br />
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {t('about.osmCopyright')}
                </a>
              </li>
              <li>{t('about.simulatedNote')}</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('about.disclaimer')}</h3>
            <p className={styles.disclaimerText}>
              {t('about.disclaimerText')}
            </p>
          </section>
          
          <div className={styles.version}>
            ShinASMR v0.1.0
          </div>
        </div>
      </div>
    </div>
  )
}
