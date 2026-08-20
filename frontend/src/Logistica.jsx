import React, { useState } from 'react';
import './Agenda.css';
import './Logistica.css';
import Traslados from './Traslados.jsx';
import Restaurantes from './Restaurantes.jsx';
import MapaEvento from './MapaEvento.jsx';

const imgHotel = "/assets/hotel_marriott_cancun.png";
const imgMapa = "/assets/mapa_salones_bloodl2026.png";
const imgRestaurantes = "/assets/logistica_restaurante_dolce_vita.png";

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
          <div className="agenda-subtitle">
            <span className="material-icons-round">event</span>
            <span>BLOOD 2026</span>
          </div>
        </div>
        <img src="/assets/icon_notification_bell.png" alt="" className="agenda-header-bell" />
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
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
            <div className="logi-route-info">
              <div className="logi-route-point">
                <span className="logi-route-time">08:59</span>
                <span className="logi-route-city">MID</span>
              </div>
              <div className="logi-flight-path">
                <div className="logi-path-line"></div>
                <img src="/assets/icon_flight_small.svg" alt="" className="logi-path-plane-icon" />
              </div>
              <div className="logi-route-point">
                <span className="logi-route-time">11:10</span>
                <span className="logi-route-city">CDMX</span>
              </div>
            </div>

            <div className="logi-transfer-inner-card">
              <img src="/assets/icon_transfer_bus.svg" alt="" className="logi-transfer-icon-box" />
              <div className="logi-transfer-text-block">
                <span className="logi-transfer-label-small">RECOGIDA EN HOTEL</span>
                <span className="logi-transfer-time-val">07:00 AM</span>
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
              <img src={imgHotel} alt="Hotel Marriot, Cancún" />
              <div className="hotel-name-overlay">
                <h3>Hotel Marriot, Cancún</h3>
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
                <img src="/assets/icon_location_pin.svg" alt="" />
                <p>Boulevard Kukulcan Km 14.5, Chac L-41, Zona Hotelera, 77500 Cancún, Q.R.</p>
              </div>
              <div className="hotel-button-group">
                <a
                  href="https://www.google.com/maps?hl=es-419&gl=MX&um=1&ie=UTF-8&fb=1&sa=X&geocode=Kduj3OtHKEyPMS-lYPg8try0&daddr=Marriott+Cancun,+An+All-Inclusive+Resort,+Boulevard+Kukulcan+Km+14.5,+Chac+L-41,+Zona+Hotelera,+77500+Canc%C3%BAn,+Q.R."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium-outline"
                  style={{ textDecoration: 'none' }}
                >
                  <img src="/assets/icon_directions.svg" alt="" />
                  Cómo llegar
                </a>
                <a
                  href="tel:+529988812000"
                  className="btn-premium-outline"
                  style={{ textDecoration: 'none' }}
                >
                  <img src="/assets/icon_phone.svg" alt="" />
                  Llamar
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa del evento */}
        <section className="logistica-section">
          <h2>Mapa del evento</h2>
          <div className="media-glass-card">
            <div className="media-container">
              <img src={imgMapa} alt="Mapa evento" />
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
