import React from 'react';
import './MapaEvento.css';

const salonesData = [
  { id: 1, name: "Salón del Prado", session: "PLENARIA" }
];

function MapaEvento({ onBack }) {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const mapUrl = "https://storage.googleapis.com/bristol-presentaciones-2026/Mapas/mapa_salones.png";

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="mapa-evento-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Mapa del evento</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>place</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
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

        <div className="salones-section">
          <h2 className="salones-title">Salones y Sesiones</h2>
          <div className="salones-list">
            {salonesData.map((salon) => (
              <div className="salon-card" key={salon.id}>
                <div className="salon-info">
                  <h3 className="salon-name">{salon.name}</h3>
                  <p className="salon-session">{salon.session}</p>
                </div>
                <div className="salon-icon">
                  <span className="material-icons-round">chevron_right</span>
                </div>
              </div>
            ))}
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
