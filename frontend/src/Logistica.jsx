import React, { useState } from 'react';
import './Logistica.css';
import Traslados from './Traslados.jsx';
import Restaurantes from './Restaurantes.jsx';
import MapaEvento from './MapaEvento.jsx';

const imgHotel = "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
const imgMapa = "/mapa-evento.png"; // User placeholder
const imgRestaurantes = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

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
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Logística</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>place</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="logistica-content">
        
        {/* Vuelos y Transfers */}
        <section className="logistica-section">
          <div className="section-title-wrapper">
            <h2>Vuelos y Transfers</h2>
            <span className="section-subtitle-link">Próximo vuelo</span>
          </div>
          <div className="flight-glass-card">
            <div className="flight-route-info">
              <div className="route-point">
                <span className="route-time">08:59</span>
                <span className="route-city">MID</span>
              </div>
              <div className="flight-path">
                <div className="path-line"></div>
                <span className="material-icons-round path-plane-icon">flight</span>
              </div>
              <div className="route-point">
                <span className="route-time">11:10</span>
                <span className="route-city">CDMX</span>
              </div>
            </div>

            <div className="transfer-inner-card">
              <div className="transfer-icon-box">
                <span className="material-icons-round" style={{color: 'white'}}>directions_bus</span>
              </div>
              <div className="transfer-text-block">
                <span className="transfer-label-small">RECOGIDA EN HOTEL</span>
                <span className="transfer-time-val">07:00 AM</span>
              </div>
            </div>

            <button 
              className="btn-premium-gradient" 
              style={{ width: '100%' }}
              onClick={() => setShowTraslados(true)}
            >
              Ver todos los traslados
            </button>
          </div>
        </section>

        {/* Hotel y Sede */}
        <section className="logistica-section">
          <h2>Hotel y Sede</h2>
          <div className="hotel-glass-card">
            <div className="hotel-image-header">
              <img src={imgHotel} alt="Hotel Paradisus" />
              <div className="hotel-name-overlay">
                <h3>Hotel Paradisus, Cancún</h3>
              </div>
            </div>
            
            <div className="hotel-times-grid">
              <div className="hotel-time-item">
                <span className="hotel-time-label">CHECK-IN</span>
                <span className="hotel-time-hour">03:00 PM</span>
              </div>
              <div className="hotel-time-divider"></div>
              <div className="hotel-time-item">
                <span className="hotel-time-label">CHECK-OUT</span>
                <span className="hotel-time-hour">12:00 PM</span>
              </div>
            </div>

            <div className="hotel-address-info">
              <div className="address-line">
                <span className="material-icons-round">location_on</span>
                <p>Blvd. Kukulcan, Zona Hotelera, 77500 Cancún, Q.R.</p>
              </div>
              <div className="hotel-button-group">
                <button className="btn-premium-outline">
                  <span className="material-icons-round">directions</span>
                  Cómo llegar
                </button>
                <button className="btn-premium-outline">
                  <span className="material-icons-round">phone</span>
                  Llamar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa del evento */}
        <section className="logistica-section">
          <h2>Mapa del evento</h2>
          <div className="media-glass-card">
            <div className="media-container" style={{ backgroundColor: 'white' }}>
              <img src={imgMapa} alt="Mapa evento" style={{ objectFit: 'contain', padding: '10px' }} />
            </div>
            <button 
              className="btn-premium-gradient"
              onClick={() => setShowMapa(true)}
            >
              Ver más
            </button>
          </div>
        </section>

        {/* Restaurantes */}
        <section className="logistica-section">
          <h2>Restaurantes</h2>
          <div className="media-glass-card">
            <div className="media-container">
              <img src={imgRestaurantes} alt="Restaurantes" />
            </div>
            <button 
              className="btn-premium-gradient"
              onClick={() => setShowRestaurantes(true)}
            >
              Ver restaurantes recomendados
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Logistica;
