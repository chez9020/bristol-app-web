import React, { useState } from 'react';
import './Constancia.css';

function Constancia({ onBack, agente }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const userName = agente?.nombre || 'Agent IO';

  const handleDownloadPDF = async () => {
    if (!agente?.id) return;
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/constancia/${agente.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Constancia_Camzyos_${userName.replace(/\s+/g, '_')}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error('Error al descargar la constancia:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="constancia-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Constancia</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>place</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="constancia-badge-wrap">
        <div className="constancia-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.47 4.54L17.9 4.1L18.75 7.45L22 8.7L21.15 12L22 15.3L18.75 16.55L17.9 19.9L14.47 19.46L12 22L9.53 19.46L6.1 19.9L5.25 16.55L2 15.3L2.85 12L2 8.7L5.25 7.45L6.1 4.1L9.53 4.54L12 2Z" fill="#ddbaf6" />
            <path d="M9 12L11 14L15 10" stroke="#4b2a8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Constancia Oficial de Finalización</span>
        </div>
      </div>

      <div className="cert-preview-wrapper">
        <div className="cert-preview-card">
          <img
            src="/assets/constancia-base.png"
            alt="Constancia de Participación"
            className="cert-preview-img"
          />
        </div>
        <div className="cert-full-screen-link">
          <span className="material-icons-round">search</span>
          Ver pantalla completa
        </div>
      </div>

      <div className="constancia-info">
        <h2>{userName}: El Futuro de la IA</h2>
        <p>Emitido el 17 de Abril, 2026</p>
      </div>

      <div className="constancia-actions">
        <button 
          className="c-btn-download-pdf" 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
        >
          <span className="material-icons-round">{isDownloading ? 'sync' : 'file_download'}</span>
          {isDownloading ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
      </div>

    </div>
  );
}

export default Constancia;
