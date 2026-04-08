import React, { useState, useEffect } from 'react';
import './DetalleConferencias.css';

// Helper time-checker
function checkIsLive(fecha, inicio, fin) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  
  const hh = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mins}`;

  if (todayStr === fecha) {
    if (timeStr >= inicio && timeStr <= fin) {
      return true;
    }
  }
  return false;
}

function DetalleConferencias({ onBack, onBiografia, conferencia }) {
  const [isLive, setIsLive] = useState(false);

  // Fallback defaults if no Object passed
  const data = conferencia || {
    titulo: 'IA 2026: Estrategia, tendencias y como construir soluciones en minutos',
    modulo: 'MÓDULO MELANOMA',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus orci molestie mauris porttitor convallis. In elementum dolor vitae malesuada tincidunt. Aenean eu neque lobortis, maximus purus vitae, feugiat purus. Sed tempus fermentum urna, eget malesuada dui pretium posuere. Aliquam erat volutpat. Suspendisse quis quam velit. Maecenas porta dignissim est, eu porttitor nunc vestibulum quis. Nunc a sollicitudin libero, at congue nunc.',
    fecha: '2026-03-06',
    horario_inicio: '14:30',
    horario_fin: '15:45',
    sala: 'Sector Delta-4',
    ponentes: [
      {
        id: 101,
        nombre: 'Pepe Ocadiz',
        puesto: 'Omnichanel Strategy AD - BMS',
        foto: 'https://ui-avatars.com/api/?name=Pepe+Ocadiz&background=random',
        biografia_larga: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus orci molestie mauris porttitor convallis. In elementum dolor vitae malesuada tincidunt. Aenean eu neque lobortis, maximus purus vitae, feugiat purus. Sed tempus fermentum urna, eget malesuada dui pretium posuere. Aliquam erat volutpat.'
      }
    ]
  };

  useEffect(() => {
    // Check if live immediately
    const evaluateLiveStatus = () => {
      setIsLive(checkIsLive(data.fecha, data.horario_inicio, data.horario_fin));
    };

    evaluateLiveStatus();

    // Check every 30 seconds to react natively to time passing
    const intervalId = setInterval(evaluateLiveStatus, 30000);
    return () => clearInterval(intervalId);
  }, [data]);

  return (
    <div className="detalle-container animate-fade-in">
      {/* Header Info */}
      <div className="perfil-header-area" style={{ borderBottom: 'none' }}>
        <div className="perfil-header-text">
          <h1>Detalle Conferencias</h1>
          <div className="perfil-header-subtitle">
            <span className="material-icons-round">event</span>
            <span>IO SUMMIT 2026 • Playa del Carmen</span>
          </div>
        </div>
        <div className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="dc-card">
        <div className="dc-modulo-label">{data.modulo}</div>
        
        <h2 className="dc-title">
          {data.titulo}
          {isLive && <span className="dc-live-badge-inline">EN VIVO</span>}
        </h2>

        <div className="dc-speakers-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          {data.ponentes.map(ponente => (
            <div key={ponente.id} className="dc-speaker-section" style={{ marginBottom: 0 }}>
              <div className="dc-speaker-info">
                <img 
                  src={ponente.foto} 
                  alt={ponente.nombre} 
                  className="dc-speaker-img"
                />
                <div className="dc-speaker-text">
                  <span className="dc-speaker-name">{ponente.nombre}</span>
                  <span className="dc-speaker-role">{ponente.puesto}</span>
                </div>
              </div>
              <button 
                className="dc-btn-biografia" 
                onClick={() => onBiografia(ponente)}
              >
                Ver biografía
              </button>
            </div>
          ))}
        </div>

        <h3 className="dc-section-title">DESCRIPCIÓN</h3>
        <p className="dc-description">{data.descripcion}</p>

        <div className="dc-info-grid">
          {/* Horario */}
          <div className="dc-info-item">
            <div className="dc-info-icon-wrapper">
              <span className="material-icons-round">schedule</span>
            </div>
            <div className="dc-info-text">
              <span className="dc-info-label">Horario</span>
              <span className="dc-info-value">{data.horario_inicio} - {data.horario_fin}</span>
            </div>
          </div>

          {/* Sala */}
          <div className="dc-info-item">
            <div className="dc-info-icon-wrapper">
              <span className="material-icons-round">location_on</span>
            </div>
            <div className="dc-info-text">
              <span className="dc-info-label">Sala de Operaciones</span>
              <span className="dc-info-value">{data.sala}</span>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}

export default DetalleConferencias;
