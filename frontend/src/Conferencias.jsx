import React, { useState, useEffect } from 'react';
import './Conferencias.css';
import { conferenciasData } from './conferenciasData';

// Cancún usa EST (UTC-5) permanente todo el año, sin cambio de horario
function checkIsLive(fecha, inicio, fin) {
  const now = new Date();

  // Forzar la hora de Cancún usando Intl (America/Cancun = EST, UTC-5 permanente)
  const cancunFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Cancun',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = cancunFormatter.formatToParts(now);
  const get = (type) => parts.find(p => p.type === type)?.value ?? '00';

  const todayStr = `${get('year')}-${get('month')}-${get('day')}`;
  const timeStr  = `${get('hour')}:${get('minute')}`;

  if (todayStr === fecha) {
    if (timeStr >= inicio && timeStr <= fin) return true;
  }
  return false;
}


function Conferencias({ onBack, onDetalle }) {
  const [activeFilter, setActiveFilter] = useState('Todas las Sesiones');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredData = conferenciasData.filter(conf => {
    const matchesFilter = activeFilter === 'Todas las Sesiones' ? true : conf.modulo.toLowerCase().includes('break');
    const matchesSearch = conf.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         conf.ponentes.some(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const liveConferencias = filteredData.filter(conf => checkIsLive(conf.fecha, conf.horario_inicio, conf.horario_fin));
  const upcomingConferencias = filteredData.filter(conf => !checkIsLive(conf.fecha, conf.horario_inicio, conf.horario_fin));

  return (
    <div className="conferencias-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Conferencias</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>event</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="conferencias-controls">
        <div className="c-search-wrapper">
          <span className="material-icons-round c-search-icon">search</span>
          <input 
            type="text" 
            className="c-search-input" 
            placeholder="Filtrar por ponente o tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="c-pills-row">
          {['Todas las Sesiones', 'Breaks Outs'].map(pill => (
            <div 
              key={pill}
              className={`c-pill ${activeFilter === pill ? 'active' : ''}`}
              onClick={() => setActiveFilter(pill)}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>

      {liveConferencias.length > 0 && (
        <div className="c-section">
          <div className="c-section-header">
            <div className="c-section-title-wrap">
              <h2 className="c-section-title">En Vivo Ahora</h2>
              <div className="c-live-dot"></div>
            </div>
            <span className="c-ver-todo">Ver todo</span>
          </div>
          
          {liveConferencias.map(conf => (
            <div key={conf.id} className="c-live-card">
              <div className="c-live-card-top">
                <span className="c-badge-live">EN VIVO</span>
                <span className="c-live-meta">{conf.horario_inicio} - {conf.horario_fin}</span>
              </div>
              <h3>{conf.titulo}</h3>
              <div className="c-live-card-bottom">
                <div className="c-speaker-info">
                  {conf.ponentes[0] && (
                    <>
                      <img src={conf.ponentes[0].foto} alt="Speaker" className="c-speaker-img" />
                      <div className="c-speaker-text">
                        <span className="c-speaker-name">{conf.ponentes[0].nombre}</span>
                        <span className="c-speaker-role">{conf.ponentes[0].puesto?.split(',')[0]}</span>
                      </div>
                    </>
                  )}
                </div>
                <button className="c-btn-details" onClick={() => onDetalle(conf)}>Ver detalles</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.entries(upcomingConferencias.reduce((acc, conf) => {
        if (!acc[conf.fecha]) acc[conf.fecha] = [];
        acc[conf.fecha].push(conf);
        return acc;
      }, {})).map(([fecha, conferenciasDelDia]) => (
        <div key={fecha} className="c-section">
          <div className="c-section-header">
            <h2 className="c-section-title">Próximas</h2>
            <span className="c-section-subtitle">
              {fecha === '2026-04-16' ? 'Jueves 16 de Abril' : 'Viernes 17 de Abril'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {conferenciasDelDia.map(conf => (
              <div key={conf.id} className="c-upcoming-card" onClick={() => onDetalle(conf)}>
                <div className="c-upcoming-time">{conf.horario_inicio}</div>
                <div className="c-upcoming-content">
                  <h4>{conf.titulo.length > 60 ? conf.titulo.substring(0, 60) + '...' : conf.titulo}</h4>
                  <div className="c-upcoming-speakers">
                    {conf.ponentes.map(p => p.nombre).join(', ')}
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
