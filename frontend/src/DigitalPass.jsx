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
        <div className="gafete-card-top">
          <img src="/assets/blood2026_home_bg.png" alt="" className="gafete-illustration" />
          <img src="/assets/bms_logo_color.svg" alt="Bristol Myers Squibb" className="gafete-logo" />
          <div className="gafete-wordmark">
            <span className="gafete-wordmark-title">BLOOD 2026</span>
            <span className="gafete-wordmark-sub">BMS LATIN AMERICA</span>
            <span className="gafete-wordmark-sub">INNOVATION OF HEMATOLOGICAL DISEASES</span>
          </div>
        </div>

        <div className="gafete-name-banner">
          <span className="gafete-doctor-name">{nombre}</span>
          <span className="gafete-code">HE-MX-2600017</span>
        </div>
      </div>
    </div>
  );
}

export default DigitalPass;
