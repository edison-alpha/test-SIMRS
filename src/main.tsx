/**
 * SIMRS Application Entry Point
 * Initializes React app with loading screen and providers
 */

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

// App Component
import { App } from './App'

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
      <App />
    </StrictMode>
  )
}
