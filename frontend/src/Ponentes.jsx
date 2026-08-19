import React from 'react';
import './Agenda.css';
import './Ponentes.css';
import { conferenciasData } from './conferenciasData.js';

function getPonentesUnicos() {
  const map = new Map();
  conferenciasData.forEach(conf => {
    (conf.ponentes || []).forEach(p => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
  });
  return Array.from(map.values());
}

function Ponentes({ onBack, onBiografia }) {
  const ponentes = getPonentesUnicos();

  return (
    <div className="ponentes-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Ponentes</h1>
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

      <div className="ponentes-intro">
        <h2>Conoce a nuestros ponentes</h2>
        <p>Descubre a los expertos que darán vida al evento. Explora su especialidad, trayectoria y experiencia profesional.</p>
      </div>

      <div className="ponentes-grid">
        {ponentes.map(p => (
          <div className="ponente-card" key={p.id}>
            <div className="ponente-photo-wrap">
              <img src={p.foto} alt={p.nombre} className="ponente-photo" />
              {p.puesto && <span className="ponente-tag">{p.puesto}</span>}
            </div>
            <h3 className="ponente-name">{p.nombre}</h3>
            <button className="btn-conoce-mas" onClick={() => onBiografia(p)}>
              Conoce más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ponentes;
