import React from 'react';
import './Agenda.css';
import './MapaEvento.css';

function MapaEvento({ onBack }) {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const mapUrl = "/assets/mapa_salones_bloodl2026.png";

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="mapa-evento-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Mapa del evento</h1>
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

      <div className="mapa-evento-content">
        <div className="map-view-card">
          <div className="map-view-hero" onClick={toggleZoom}>
            <img src={mapUrl} alt="Mapa" className="map-view-img" />
            <div className="zoom-hint">
              <span className="material-icons-round">zoom_in</span>
              <span>Toca para ampliar</span>
            </div>
          </div>
          <div className="map-view-actions">
            <button className="btn-download-map" onClick={toggleZoom}>
              <span className="material-icons-round">fullscreen</span>
              Ampliar Mapa
            </button>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div className="map-fullscreen-overlay animate-fade-in" onClick={toggleZoom}>
          <div className="close-zoom-btn">
            <span className="material-icons-round">close</span>
          </div>
          <div className="fullscreen-img-wrapper" onClick={(e) => e.stopPropagation()}>
            <img src={mapUrl} alt="Mapa Fullscreen" className="fullscreen-img" />
          </div>
          <p className="zoom-instructions">Puedes usar dos dedos para ampliar el mapa</p>
        </div>
      )}
    </div>
  );
}

export default MapaEvento;
