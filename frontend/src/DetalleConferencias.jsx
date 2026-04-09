import React from 'react';
import './DetalleConferencias.css';

function DetalleConferencias({ onBack, onBiografia, conferencia }) {
  // Use provided conferencia or a robust default
  const data = conferencia || {
    titulo: 'MCH Obstructiva: Evolución del tratamiento farmacológico hasta las terapias dirigidas. “CENA”',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus orci molestie mauris porttitor convallis. In elementum dolor vitae malesuada tincidunt. Aenean eu neque lobortis, maximus purus vitae, feugiat purus.',
    horario_inicio: '19:55',
    horario_fin: '20:55',
    sala: 'Cypress',
    ponentes: [
      {
        id: 1,
        nombre: 'Dr. Enrique A. Berríos Bárcenas',
        puesto: 'México',
        foto: 'https://ui-avatars.com/api/?name=Enrique+Berrios&background=random',
      }
    ]
  };

  const handleDownload = () => {
    // We'll use the presentation link if it exists in data, else a generic placeholder
    const link = data.presentation_link || '#';
    window.open(link, '_blank');
  };

  return (
    <div className="detalle-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Detalle Conferencias</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>event</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="dc-card">
        <h2 className="dc-title">{data.titulo}</h2>

        {data.ponentes?.map(ponente => (
          <div key={ponente.id} className="dc-speaker-section">
            <div className="dc-speaker-info">
              <img src={ponente.foto} alt={ponente.nombre} className="dc-speaker-img" />
              <div className="dc-speaker-text">
                <span className="dc-speaker-name">{ponente.nombre}</span>
                <span className="dc-speaker-role">{ponente.puesto}</span>
              </div>
            </div>
            <button className="dc-btn-biografia" onClick={() => onBiografia(ponente)}>
              Ver biografía
            </button>
          </div>
        ))}

        <h3 className="dc-section-title">DESCRIPCIÓN</h3>
        <p className="dc-description">{data.descripcion}</p>

        <div className="dc-info-grid">
          <div className="dc-info-item">
            <div className="dc-info-icon-wrapper">
              <span className="material-icons-round">schedule</span>
            </div>
            <div className="dc-info-text">
              <span className="dc-info-label">Horario</span>
              <span className="dc-info-value">{data.horario_inicio} - {data.horario_fin}</span>
            </div>
          </div>

          <div className="dc-info-item">
            <div className="dc-info-icon-wrapper">
              <span className="material-icons-round">location_on</span>
            </div>
            <div className="dc-info-text">
              <span className="dc-info-label">Sala</span>
              <span className="dc-info-value">{data.sala}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dc-actions">
        <button className="btn-download-presentation" onClick={handleDownload}>
          <span className="material-icons-round">file_download</span>
          Descargar presentación
        </button>
      </div>
      
    </div>
  );
}

export default DetalleConferencias;
