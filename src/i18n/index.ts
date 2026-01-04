import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // App
      'app.title': 'ShinASMR',
      'app.subtitle': 'Relaxing Train Simulator',
      
      // Controls
      'controls.play': 'Play',
      'controls.pause': 'Pause',
      'controls.speed': 'Speed',
      'controls.time': 'Time',
      'controls.realtime': 'Real-time',
      
      // Train info
      'train.service': 'Service',
      'train.type': 'Type',
      'train.route': 'Route',
      'train.nextStop': 'Next Stop',
      'train.speed': 'Speed',
      'train.progress': 'Progress',
      'train.status.running': 'Running',
      'train.status.stopped': 'At Station',
      'train.status.waiting': 'Not Started',
      'train.status.completed': 'Journey Complete',
      
      // Station info
      'station.name': 'Station',
      'station.platforms': 'Platforms',
      'station.services': 'Services',
      
      // Camera
      'camera.follow': 'Follow Train',
      'camera.exit': 'Exit Follow Mode',
      'camera.reset': 'Reset View',
      
      // Audio
      'audio.enable': 'Enable Sound',
      'audio.mute': 'Mute',
      'audio.unmute': 'Unmute',
      'audio.volume': 'Volume',
      
      // Modals
      'about.title': 'About ShinASMR',
      'about.description': 'A relaxing train simulation experience featuring Japan\'s famous Shinkansen bullet trains.',
      'about.attribution': 'Data Sources',
      'about.osmNote': 'Map silhouette inspired by OpenStreetMap',
      'about.osmCopyright': '© OpenStreetMap contributors',
      'about.simulatedNote': 'Timetable data is simulated and approximate',
      'about.disclaimer': 'Disclaimer',
      'about.disclaimerText': 'This is a relaxing simulation for entertainment purposes. Train positions are NOT real-time and do NOT reflect actual operations. Not affiliated with JR or any railway company.',
      'about.close': 'Close',
      
      // Support
      'support.title': 'Support',
      'support.text': 'If you enjoy this simulator, consider supporting its development!',
      'support.button': 'Support on Ko-fi',
      
      // Misc
      'misc.loading': 'Loading...',
      'misc.error': 'Something went wrong',
      'misc.noSelection': 'Tap a train or station to see details',
      'misc.kmh': 'km/h',
      'misc.km': 'km',
    }
  },
  // Placeholder for Japanese - demonstrates i18n architecture
  ja: {
    translation: {
      'app.title': 'ShinASMR',
      'app.subtitle': 'リラックス電車シミュレーター',
      // ... more translations would go here
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
