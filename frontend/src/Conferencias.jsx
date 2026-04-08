import React, { useState, useEffect } from 'react';
import './Conferencias.css';
import { conferenciasData } from './conferenciasData';

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

function Conferencias({ onBack, onDetalle }) {
  const [activeFilter, setActiveFilter] = useState('Todas las Sesiones');
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Re-render every 30s to check live status
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter based on activeFilter (Pills)
  const filteredData = conferenciasData.filter(conf => {
    if (activeFilter === 'Todas las Sesiones') return true;
    // Assuming 'Breaks Outs' would match specific modules or maybe adding a flag
    // Currently, let's just make it return nothing if it doesn't match a generic rule, 
    // or simulate that none of these are breakouts.
    return activeFilter === 'Breaks Outs' ? conf.modulo.toLowerCase().includes('break') : true;
  });

  const liveConferencias = filteredData.filter(conf => checkIsLive(conf.fecha, conf.horario_inicio, conf.horario_fin));
  const upcomingConferencias = filteredData.filter(conf => !checkIsLive(conf.fecha, conf.horario_inicio, conf.horario_fin));

  return (
    <div className="conferencias-container animate-fade-in">
      {/* Header Info */}
      <div className="perfil-header-area" style={{ borderBottom: 'none' }}>
        <div className="perfil-header-text">
          <h1>Conferencias</h1>
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

      {/* Controls & Search */}
      <div className="conferencias-controls">
        <div className="c-search-wrapper">
          <span className="material-icons-round c-search-icon">search</span>
          <input 
            type="text" 
            className="c-search-input" 
            placeholder="Filtrar por ponente o tema..."
          />
        </div>
        
        <div className="c-pills-row">
          <div 
            className={`c-pill ${activeFilter === 'Todas las Sesiones' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Todas las Sesiones')}
          >
            Todas las Sesiones
          </div>
          <div 
            className={`c-pill ${activeFilter === 'Breaks Outs' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Breaks Outs')}
          >
            Breaks Outs
          </div>
        </div>
      </div>

      {/* Live Now Section */}
      {liveConferencias.length > 0 && (
        <div className="c-section">
          <div className="c-section-header">
            <div className="c-section-title-wrap">
              <h2 className="c-section-title">En Vivo Ahora</h2>
              <div className="c-live-dot"></div>
            </div>
          </div>
          
          {liveConferencias.map(conf => (
            <div key={conf.id} className="c-live-card" style={{ marginBottom: '16px' }}>
              <div className="c-live-card-top">
                <span className="c-badge-live">EN VIVO</span>
                <span className="c-live-meta">{conf.sala} • {conf.horario_inicio} - {conf.horario_fin}</span>
              </div>
              
              <h3>{conf.titulo}</h3>
              
              <div className="c-live-card-bottom">
                <div className="c-speaker-info">
                  {conf.ponentes.length > 0 && (
                    <>
                      <img 
                        src={conf.ponentes[0].foto} 
                        alt={conf.ponentes[0].nombre} 
                        className="c-speaker-img"
                      />
                      <div className="c-speaker-text">
                        <span className="c-speaker-name" style={{ fontSize: '13px' }}>
                          {conf.ponentes.length > 1 ? `${conf.ponentes[0].nombre} y más...` : conf.ponentes[0].nombre}
                        </span>
                        <span className="c-speaker-role">{conf.ponentes[0].puesto}</span>
                      </div>
                    </>
                  )}
                </div>
                <button className="c-btn-details" onClick={() => onDetalle(conf)}>
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Section Grouped by Date */}
      {Object.entries(upcomingConferencias.reduce((acc, conf) => {
        if (!acc[conf.fecha]) acc[conf.fecha] = [];
        acc[conf.fecha].push(conf);
        return acc;
      }, {})).map(([fecha, conferenciasDelDia]) => (
        <div key={fecha} className="c-section">
          <div className="c-section-header">
            <h2 className="c-section-title">Programación</h2>
            <span className="c-section-subtitle">
              {fecha === '2026-03-06' ? 'Viernes 6 de Marzo' : 
               fecha === '2026-03-07' ? 'Sábado 7 de Marzo' : 
               fecha}
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {conferenciasDelDia.map(conf => (
              <div key={conf.id} className="c-upcoming-card" onClick={() => onDetalle(conf)}>
                <div className="c-upcoming-time">
                  {conf.horario_inicio}
                </div>
                <div className="c-upcoming-content">
                  <h4>{conf.titulo.length > 50 ? conf.titulo.substring(0, 50) + '...' : conf.titulo}</h4>
                  <div className="c-upcoming-speakers">
                    {conf.ponentes.map((p, index) => (
                      <span key={p.id || index}>{p.nombre}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Conferencias;
