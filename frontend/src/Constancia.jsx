import React, { useRef, useState } from 'react';
import './Constancia.css';

function Constancia({ onBack, agente }) {
  const certRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Use real data safely, or fallback
  const userName = agente?.nombre ? `${agente.nombre} ${agente.apellidos || ''}`.trim() : 'Alex Morgan';
  const userId = agente?.id ? agente.id.substring(0,7).toUpperCase() : '8X9-22B';

  // Escala el tamaño de fuente automáticamente según la longitud del nombre
  // Igual que el backend: si el nombre es largo, se reduce hasta caber en la línea
  const BASE_FONT_VW = 4;     // tamaño base en vw
  const MAX_CHARS    = 22;    // caracteres antes de empezar a reducir
  const nameLen      = userName.length;
  const scaledFontVw = nameLen > MAX_CHARS
    ? Math.max(1.8, BASE_FONT_VW * (MAX_CHARS / nameLen))
    : BASE_FONT_VW;
  const nameStyle = { fontSize: `clamp(9px, ${scaledFontVw.toFixed(2)}vw, 22px)` };

  const handleDownloadPDF = async () => {
    if (!agente?.id) {
      alert('No se encontró tu sesión. Por favor vuelve a iniciar sesión.');
      return;
    }
    setIsDownloading(true);

    try {
      // Llama al backend para generar el PDF con el nombre del agente
      const response = await fetch(`/api/constancia/${agente.id}`);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Error al generar la constancia');
      }

      // Convertir respuesta a blob y forzar descarga
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Constancia_AOS_${userName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al descargar la constancia:', error);
      alert(`Hubo un error al generar tu constancia: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <div className="constancia-container animate-fade-in">
      {/* Header Info */}
      <div className="perfil-header-area">
        <div className="perfil-header-text">
          <h1>Constancia</h1>
          <div className="perfil-header-subtitle">
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="#008fb4" style={{flexShrink: 0}}>
              <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
            </svg>
            <span>IO SUMMIT 2026 • Playa del Carmen</span>
          </div>
        </div>
        <div className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="constancia-badge-wrap">
        <div className="constancia-badge">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 -960 960 960" fill="#008fb4" style={{flexShrink: 0}}>
            <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 52 136-52 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-52-136 52Zm34-114 102-38 102 38 56-96 108-24-10-112 74-84-74-84 10-112-108-24-56-96-102 38-102-38-56 96-108 24 10 112-74 84 74 84-10 112 108 24 56 96Zm102-124 204-204-58-54-146 148-72-72-56 56 128 126Zm0-182Z"/>
          </svg>
          <span>Constancia Oficial de Finalización</span>
        </div>
      </div>

      {/* Preview real de la constancia */}
      <div className="cert-preview-wrapper">
        <div className="cert-preview-card">
          {/* Imagen base de la constancia */}
          <img
            src="/assets/constancia-base.png"
            alt="Constancia de Participación"
            className="cert-preview-img"
          />
          {/* Nombre del agente superpuesto — se achica si el nombre es muy largo */}
          <div className="cert-preview-name" style={nameStyle}>{userName}</div>
        </div>
      </div>

      <div className="constancia-info">
        <h2>IO Summit 2026: Agentes IO</h2>
        <p>Emitido el 7 de Marzo, 2026</p>
      </div>

      <div className="constancia-actions">
        <button 
          className="c-btn-download-pdf" 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          style={{ opacity: isDownloading ? 0.7 : 1, cursor: isDownloading ? 'not-allowed' : 'pointer' }}
        >
          {isDownloading ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="spin-slow" height="20" width="20" viewBox="0 -960 960 960" fill="white" style={{marginRight: '8px', animation: 'spin 1s linear infinite'}}>
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 126.5 24.5T708-712v-88h80v240H548v-80h142q-40-35-90.5-52.5T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q88 0 152-54.5T713-324l77 24q-33 100-118 160t-192 60Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="white" style={{marginRight: '8px'}}>
              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
            </svg>
          )}
          {isDownloading ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
      </div>
    </div>
  );
}

export default Constancia;
