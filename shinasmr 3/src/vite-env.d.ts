/// <reference types="vite/client" />

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

// Howler.js
declare module 'howler' {
  export class Howl {
    constructor(options: {
      src: string[]
      loop?: boolean
      volume?: number
      html5?: boolean
      onloaderror?: () => void
      onload?: () => void
    })
    play(): number
    pause(): this
    stop(): this
    volume(vol?: number): this | number
  }
  
  export const Howler: {
    volume(vol?: number): number | typeof Howler
  }
}
