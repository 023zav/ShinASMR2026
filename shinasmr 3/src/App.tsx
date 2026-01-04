import { useEffect, useState } from 'react'
import {
  Scene,
  TimeControls,
  DetailsPanel,
  AudioControls,
  Header,
  AboutModal,
  SupportModal
} from '@/components'

interface AppProps {
  onReady?: () => void
}

export default function App({ onReady }: AppProps) {
  const [sceneReady, setSceneReady] = useState(false)
  
  useEffect(() => {
    if (sceneReady) {
      onReady?.()
    }
  }, [sceneReady, onReady])
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 3D Scene */}
      <Scene onReady={() => setSceneReady(true)} />
      
      {/* UI Overlays */}
      <TimeControls />
      <AudioControls />
      <Header />
      <DetailsPanel />
      
      {/* Modals */}
      <AboutModal />
      <SupportModal />
    </div>
  )
}
