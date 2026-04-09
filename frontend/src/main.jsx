import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PreguntasPonentes from './PreguntasPonentes.jsx'

const root = createRoot(document.getElementById('root'));

// Simple manual router to handle the /preguntas-ponentes "endpoint"
if (window.location.pathname === '/preguntas-ponentes') {
  root.render(
    <StrictMode>
      <PreguntasPonentes />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
