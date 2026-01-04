import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'
import './index.css'

// Hide loading screen once React is ready
const hideLoading = () => {
  const loading = document.getElementById('loading')
  if (loading) {
    loading.classList.add('hidden')
    setTimeout(() => loading.remove(), 500)
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App onReady={hideLoading} />
  </React.StrictMode>
)
