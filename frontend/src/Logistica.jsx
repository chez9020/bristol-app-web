import React, { useState } from 'react';
import './Logistica.css';
import Traslados from './Traslados.jsx';
import Restaurantes from './Restaurantes.jsx';
import MapaEvento from './MapaEvento.jsx';

// Using consistent image assets 
const imgHotel = "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"; // Using an Unsplash resort image as a good approximation
const imgMapa = "/mapa-evento.png"; // Floor plan placeholder
const imgRestaurantes = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"; // Restaurant food placeholder

function Logistica({ onBack }) {
  const [showTraslados, setShowTraslados] = useState(false);
  const [showRestaurantes, setShowRestaurantes] = useState(false);
  const [showMapa, setShowMapa] = useState(false);

  if (showTraslados) {
    return <Traslados onBack={() => setShowTraslados(false)} />;
  }

  if (showRestaurantes) {
    return <Restaurantes onBack={() => setShowRestaurantes(false)} />;
  }

  if (showMapa) {
    return <MapaEvento onBack={() => setShowMapa(false)} />;
  }

  return (
    <div className="logistica-container animate-fade-in">
      {/* Header that mimics the sticky headers in other views */}
      <div className="perfil-header-area">
        <div className="perfil-header-text">
          <h1>Logística</h1>
          <div className="perfil-header-subtitle">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="#008fb4" style={{flexShrink: 0}}>
                <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
              </svg>
              <span>IO SUMMIT 2026 • Playa del Carmen</span>
            </div>
        </div>
        <div className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="logistica-content">
        
        {/* Vuelos y Transfers Section */}
        <div className="logistica-section">
          <div className="section-header">
            <h2>Vuelos y Transfers</h2>
            <span className="subsection-link">Próximo vuelo</span>
          </div>

          <div className="vuelos-card">
            <div className="vuelos-times">
              <div className="time-block">
                <span className="time-large">08:59</span>
                <span className="city-small">MID</span>
              </div>
              
              <div className="flight-divider">
                <div className="divider-line"></div>
                <span className="material-icons-round flight-icon">flight</span>
              </div>
              
              <div className="time-block right">
                <span className="time-large">11:10</span>
                <span className="city-small">CDMX</span>
              </div>
            </div>

            <div className="transfer-info">
              <div className="transfer-icon-wrapper">
                <span className="material-icons-round">directions_bus</span>
              </div>
              <div className="transfer-details">
                <span className="transfer-label">Recogida en Hotel</span>
                <span className="transfer-time">07:00 AM</span>
              </div>
            </div>
            
            <button className="btn-all-transfers" onClick={() => setShowTraslados(true)}>
              Ver todos los traslados
            </button>
          </div>
        </div>

        {/* Hotel y Sede Section */}
        <div className="logistica-section">
          <div className="section-header">
            <h2>Hotel y Sede</h2>
          </div>

          <div className="hotel-card">
            <div className="hotel-hero">
              <img src={imgHotel} alt="Hotel Paradisus" className="hotel-img" />
              <div className="hotel-hero-overlay"></div>
              <h3 className="hotel-name">Hotel Paradisus,<br/>Playa del Carmen</h3>
            </div>
            
            <div className="hotel-times">
              <div className="time-block-hotel">
                <span className="hotel-label">CHECK-IN</span>
                <span className="hotel-time-value">15:00 PM</span>
              </div>
              <div className="hotel-divider"></div>
              <div className="time-block-hotel align-right">
                <span className="hotel-label">CHECK-OUT</span>
                <span className="hotel-time-value">12:00 PM</span>
              </div>
            </div>

            <div className="hotel-actions">
              <div className="hotel-address">
                <span className="material-icons-round location-icon">location_on</span>
                <span className="address-text">5 Av. Nte., 77728 Playa del Carmen, Q.R.</span>
              </div>

              <div className="hotel-buttons-row">
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=Hotel+Paradisus+Playa+del+Carmen" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-directions"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="material-icons-round">directions</span>
                  Cómo llegar
                </a>
                <a 
                  href="tel:9848773900" 
                  className="btn-call"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="material-icons-round">phone</span>
                  Llamar
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa del evento Section */}
        <div className="logistica-section">
          <div className="section-header">
            <h2>Mapa del evento</h2>
          </div>

          <div className="image-card">
            <div className="image-hero map-hero">
              <img src={imgMapa} alt="Mapa del evento" className="content-img map-img" />
            </div>
            <div className="card-actions-single">
              <button className="btn-primary-action" onClick={() => setShowMapa(true)}>
                Ver más
              </button>
            </div>
          </div>
        </div>

        {/* Restaurantes Section */}
        <div className="logistica-section">
          <div className="section-header">
            <h2>Restaurantes</h2>
          </div>

          <div className="image-card">
            <div className="image-hero food-hero">
              <img src={imgRestaurantes} alt="Restaurantes" className="content-img" />
            </div>
            <div className="card-actions-single">
              <button className="btn-primary-action" style={{fontSize: '11px'}} onClick={() => setShowRestaurantes(true)}>
                Ver restaurantes recomendados
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Logistica;
