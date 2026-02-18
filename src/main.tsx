/**
 * SIMRS Application Entry Point
 * Initializes React app with loading screen and providers
 */

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

// App Component
import { AppWithLoading } from './app-with-loading'

// Styles
import './styles/index.css'
import './styles/print.css'

// Ensure CSS variables are loaded before React renders

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AppWithLoading />
    </StrictMode>
  )
}
