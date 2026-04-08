import React from 'react';
import './MapaEvento.css';

const imgMapa = "/mapa-evento.png";

const salonesData = [
  {
    id: 1,
    name: "Cypress I, II, III",
    session: "PLENARIA"
  },
  {
    id: 2,
    name: "Cypress I, II",
    session: "BO 1 - EXPERT MEETING MELANOMA,\nMelanoma Steel"
  },
  {
    id: 3,
    name: "Oysterwood",
    session: "BO 1- EXPERT MEETING GU, Kidney Falcon"
  }
];

function MapaEvento({ onBack }) {
  // Function to handle map download (simulated for now)
  const handleDownloadMap = () => {
    // In a real app, this would trigger a file download.
    // E.g. creating an <a> tag and clicking it programmatically
    alert("Descargando mapa del evento...");
  };

  return (
    <div className="mapa-evento-container animate-fade-in">
      {/* Header */}
      <div className="perfil-header-area">
        <div className="perfil-header-text">
          <h1>Mapa del evento</h1>
          <div className="perfil-header-subtitle">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 -960 960 960" fill="#008fb4" style={{flexShrink: 0}}>
              <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 52 136-52 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-52-136 52Zm34-114 102-38 102 38 56-96 108-24-10-112 74-84-74-84 10-112-108-24-56-96-102 38-102-38-56 96-108 24 10 112-74 84 74 84-10 112 108 24 56 96Zm102-124 204-204-58-54-146 148-72-72-56 56 128 126Zm0-182Z"/>
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

      <div className="mapa-evento-content">
        {/* Map Card */}
        <div className="map-view-card">
          <div className="map-view-hero">
            <img src={imgMapa} alt="Plano del recinto" className="map-view-img" />
          </div>
          <div className="map-view-actions">
            <button className="btn-download-map" onClick={handleDownloadMap}>
              <span className="material-icons-round">file_download</span>
              Descargar Mapa
            </button>
          </div>
        </div>

        {/* Salones y Sesiones List */}
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
