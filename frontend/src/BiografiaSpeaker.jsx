import React from 'react';
import './BiografiaSpeaker.css';

function BiografiaSpeaker({ onBack, ponente }) {
  // Fallback info exactly matching mockup if no data is passed yet
  const data = ponente || {
    nombre: 'Pepe Ocadiz',
    puesto: 'Omnichanel Strategy AD - BMS',
    foto: 'https://ui-avatars.com/api/?name=Pepe+Ocadiz&background=random',
    biografia_larga: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus orci molestie mauris porttitor convallis. In elementum dolor vitae malesuada tincidunt. Aenean eu neque lobortis, maximus purus vitae, feugiat purus. Sed tempus fermentum urna, eget malesuada dui pretium posuere. Aliquam erat volutpat. Suspendisse quis quam velit. Maecenas porta dignissim est, eu porttitor nunc vestibulum quis. Nunc a sollicitudin libero, at congue nunc. Ut elementum tristique ex in sollicitudin.'
  };

  return (
    <div className="biografia-container animate-fade-in">
      {/* Header Info */}
      <div className="perfil-header-area" style={{ borderBottom: 'none' }}>
        <div className="perfil-header-text">
          <h1>Biografía Speaker</h1>
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
        <p className="bs-description">{data.biografia_larga}</p>
      </div>

      {/* Download Button */}
      {data.pptUrl && (
        <a 
          href={data.pptUrl} 
          download 
          className="bs-btn-download" 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '12px', 
            backgroundColor: '#008fb4', 
            color: 'white', 
            padding: '16px', 
            margin: '0 20px 24px 20px', 
            borderRadius: '4px', 
            textDecoration: 'none', 
            fontFamily: '"Gotham", sans-serif', 
            fontWeight: '700', 
            fontSize: '14px', 
            boxShadow: '0 10px 15px -3px rgba(0, 143, 180, 0.2), 0 4px 6px -4px rgba(0, 143, 180, 0.2)',
            marginTop: 'auto'
          }}
        >
          <span className="material-icons-round">download</span>
          Descargar presentación
        </a>
      )}
    </div>
  );
}

export default BiografiaSpeaker;
