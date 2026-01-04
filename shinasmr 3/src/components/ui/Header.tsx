import { useTranslation } from 'react-i18next'
import { useSimulationStore } from '@/store'
import styles from './Header.module.css'

export function Header() {
  const { t } = useTranslation()
  
  const setAboutOpen = useSimulationStore(s => s.setAboutOpen)
  
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <svg className={styles.logo} width="24" height="24" viewBox="0 0 100 100">
          <path d="M20 60 L50 30 L80 60" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <ellipse cx="50" cy="70" rx="25" ry="8" fill="currentColor" opacity="0.3"/>
        </svg>
        <div className={styles.titles}>
          <h1 className={styles.title}>{t('app.title')}</h1>
          <span className={styles.subtitle}>{t('app.subtitle')}</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <a
          href="https://ko-fi.com/shinasmr"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.supportButton}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>{t('support.title')}</span>
        </a>
        
        <button
          className={styles.aboutButton}
          onClick={() => setAboutOpen(true)}
          aria-label="About"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
