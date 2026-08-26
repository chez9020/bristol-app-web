import React from 'react';
import './Agenda.css';
import './DigitalPass.css';

const QR_BUCKET_URL = 'https://storage.googleapis.com/shaq-invitaciones-bucket/qrs';

function DigitalPass({ onBack, agente }) {
  const nombre = agente?.nombre || 'Agente';
  const qrUrl = agente?.id ? `${QR_BUCKET_URL}/${agente.id}.png` : '/assets/blood2026_gafete_qr_placeholder.png';

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

      <div className="gafete-eco-banner">
        <p className="gafete-eco-title">Un pequeño cambio puede generar un gran impacto.</p>
        <p className="gafete-eco-text">
          Te recordamos que tu gafete físico es sustentable. Está elaborado con papel semilla de chía,
          una alternativa que busca reducir los residuos generados durante el evento.{' '}
          <strong>Al finalizar, no lo deseches: plántalo, riégalo y dale la oportunidad de convertirse en una nueva planta.</strong>
        </p>
      </div>

      <div className="gafete-card">
        <img src="/assets/blood2026_gafete_card.png" alt="" className="gafete-card-bg" />
        <img src={qrUrl} alt="Código QR" className="gafete-qr" />
        <span className="gafete-doctor-name">{nombre}</span>
      </div>

    </div>
  );
}

export default DigitalPass;
