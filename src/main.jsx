import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// On regarde si l'URL contient ?mode=display
const isDisplayMode = new URLSearchParams(window.location.search).get('mode') === 'display';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App isDisplayMode={isDisplayMode} />
  </StrictMode>,
)