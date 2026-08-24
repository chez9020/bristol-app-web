import React from 'react';
import './Agenda.css';
import './DigitalPass.css';

function DigitalPass({ onBack, agente }) {
  const nombre = agente?.nombre || 'Agente';

  return (
    <div className="digital-pass-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Digital pass</h1>
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

      <div className="gafete-card">
        <img src="/assets/blood2026_gafete_card.png" alt="" className="gafete-card-bg" />
        <div className="gafete-code-cover" />
        <img src="/assets/blood2026_gafete_qr_placeholder.png" alt="Código QR" className="gafete-qr" />
        <span className="gafete-doctor-name">{nombre}</span>
      </div>

      <div className="gafete-legal-code">HE-MX-2600018</div>
    </div>
  );
}

export default DigitalPass;
