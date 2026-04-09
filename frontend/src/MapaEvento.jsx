import React from 'react';
import './MapaEvento.css';

const salonesData = [
  { id: 1, name: "Salón del Prado", session: "PLENARIA" },
  { id: 2, name: "Salón Goya", session: "PLENARIA" },
  { id: 3, name: "Salón Picasso", session: "PLENARIA" }
];

function MapaEvento({ onBack }) {
  const handleDownloadMap = () => {
    alert("Iniciando descarga del mapa...");
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
          <div className="map-view-hero">
            <img src="/mapa-evento.png" alt="Mapa" className="map-view-img" />
          </div>
          <div className="map-view-actions">
            <button className="btn-download-map" onClick={handleDownloadMap}>
              <span className="material-icons-round">file_download</span>
              Descargar Mapa
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
    </div>
  );
}

export default MapaEvento;
