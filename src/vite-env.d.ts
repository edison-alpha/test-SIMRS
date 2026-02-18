/// <reference types="vite/client" />

declare global {
  interface Window {
    hideInitialLoader: () => void
  }
}

export {}
