import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ResultadosEnVivo from './ResultadosEnVivo.jsx'

// Detect if we should show the presenter/projector view
// Usage: open tusitio.com/#resultados on your laptop/projector
const isPresenterView = window.location.hash === '#resultados' || window.location.hash === '#resultado';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPresenterView ? <ResultadosEnVivo /> : <App />}
  </StrictMode>,
)
