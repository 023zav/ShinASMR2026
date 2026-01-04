import { useTranslation } from 'react-i18next'
import { useSimulationStore } from '@/store'
import styles from './Header.module.css'

export function Header() {
  const { t } = useTranslation()
  
  const setAboutOpen = useSimulationStore(s => s.setAboutOpen)
  const setSupportOpen = useSimulationStore(s => s.setSupportOpen)
  
  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <span className={styles.logo}>🚄</span>
        <span className={styles.title}>{t('app.title')}</span>
      </div>
      
      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={() => setAboutOpen(true)}
        >
          About
        </button>
        
        <button
          className={`${styles.button} ${styles.support}`}
          onClick={() => setSupportOpen(true)}
        >
          ❤️ Support
        </button>
      </div>
    </div>
  )
}
