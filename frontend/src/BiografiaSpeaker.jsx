import React from 'react';
import './BiografiaSpeaker.css';

function BiografiaSpeaker({ onBack, ponente }) {
  // Use provided ponente or default
  const data = ponente || {
    nombre: 'Dr. Enrique A. Berríos',
    puesto: 'México',
    foto: 'https://storage.googleapis.com/bristol-presentaciones-2026/Presentadores/Enrique%20Berrios.png',
    biografia_larga: 'Doctor en Medicina por la Universidad de El Salvador...\nMaestría y Doctorado...'
  };

  // Convert the bio text (split by \n) into an array for bullet points
  const bioLines = data.biografia_larga ? data.biografia_larga.split('\n').filter(line => line.trim() !== '') : [];

  return (
    <div className="biografia-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Biografía Speaker</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>event</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="bs-card">
        <div className="bs-speaker-header">
          <img 
            src={data.foto} 
            alt={data.nombre} 
            className="bs-speaker-img"
          />
          <h2 className="bs-speaker-name">{data.nombre}</h2>
          <p className="bs-speaker-role">{data.puesto}</p>
        </div>

        <div className="bs-divider"></div>

        <h3 className="bs-section-title">BIOGRAFÍA</h3>
        <ul className="bs-bio-list">
          {bioLines.map((line, index) => (
            <li key={index} className="bs-bio-item">{line.trim()}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default BiografiaSpeaker;
