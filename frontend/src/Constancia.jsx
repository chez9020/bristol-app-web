import React, { useState, useEffect, useRef } from 'react';
import './Agenda.css';
import './Constancia.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ENCUESTAS, estadoLocal, leerEstado } from './encuestasEstado';

// La constancia exige las dos encuestas, entrada y salida.
const pendientesDe = (estado) => ENCUESTAS.filter(e => !estado[e.clave]).map(e => e.nombre);

function Constancia({ onBack, onGoToEncuesta, agente }) {
  const certCardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [faltantes, setFaltantes] = useState(() => pendientesDe(estadoLocal(agente?.id)));
  const surveyCompleted = faltantes.length === 0;
  const faltantesTexto = faltantes.length === 2
    ? 'las encuestas de entrada y de salida'
    : `la encuesta ${faltantes[0] || ''}`;
  const faltantesTitulo = faltantes.length === 2 ? 'Encuestas pendientes' : 'Encuesta pendiente';
  const [checkingPrev, setCheckingPrev] = useState(true);
  const [showEncuestaAlert, setShowEncuestaAlert] = useState(false);

  const userName = agente?.nombre || 'Invitado';
  const nombreFontSize =
    userName.length > 28 ? '2.5cqw' :
    userName.length > 22 ? '3cqw' :
    userName.length > 16 ? '3.6cqw' : '4.394cqw';

  useEffect(() => {
    const checkPreviousSubmission = async () => {
      if (!agente?.id) { setCheckingPrev(false); return; }
      // localStorage puede estar vacío (otro dispositivo, caché limpia):
      // la bandera de Firestore manda.
      setFaltantes(pendientesDe(await leerEstado(agente.id)));
      setCheckingPrev(false);
    };
    checkPreviousSubmission();
  }, [agente?.id]);

  useEffect(() => {
    if (!checkingPrev && !surveyCompleted) setShowEncuestaAlert(true);
  }, [checkingPrev, surveyCompleted]);

  const handleDownloadPDF = async () => {
    if (!certCardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certCardRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Constancia_${userName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error al generar la constancia:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const header = (
    <header className="agenda-header">
      <div className="agenda-header-text">
        <h1>Constancia</h1>
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
  );

  if (checkingPrev) {
    return (
      <div className="constancia-container animate-fade-in">
        {header}
        <div className="checking-screen">
          <div className="checking-spinner"></div>
          <p>Verificando tu constancia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="constancia-container animate-fade-in">
      {header}

      {surveyCompleted ? (
        <div className="survey-success-container">
          <div ref={certCardRef} className="cert-figma-card animate-pop-in">
            <img src="/assets/blood2026_constancia_bg.png" alt="" className="cert-figma-bg" crossOrigin="anonymous" />
            <img src="/assets/blood2026_constancia_logo_bms.png" alt="" className="cert-figma-logo-bms" />
            <p className="cert-figma-otorga">Otorga la siguiente</p>
            <p className="cert-figma-titulo">CONSTANCIA</p>
            <span className="cert-figma-a">a:</span>
            <img src="/assets/blood2026_constancia_linea_nombre.png" alt="" className="cert-figma-linea-nombre" />
            <h2 className="cert-figma-nombre" style={{ fontSize: nombreFontSize }}>{userName}</h2>
            <div className="cert-figma-parrafo">
              <p>por su participación en el evento:</p>
              <p className="cert-figma-parrafo-strong">&ldquo;BLOOD 2026&rdquo;.</p>
              <p>Llevado a cabo el 28 y 29 de agosto del 2026</p>
              <p>en el Hotel Marriot, Cancun, Q.R, México.</p>
            </div>
            <img src="/assets/blood2026_constancia_linea_firma.svg" alt="" className="cert-figma-linea-firma" />
            <img src="/assets/blood2026_constancia_firma.png" alt="" className="cert-figma-firma" />
            <p className="cert-figma-firmante">
              Miguel Sierra
              <span>Associate Director, Onco-Hemato</span>
            </p>
            <img src="/assets/blood2026_constancia_logo.png" alt="" className="cert-figma-logo" />
            <span className="cert-figma-codigo">HE-MX-2600035</span>
          </div>

          <div className="constancia-actions animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              className="c-btn-download-pdf"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              <span className="material-icons-round">{isDownloading ? 'sync' : 'download'}</span>
              {isDownloading ? 'Generando PDF...' : 'Descargar PDF'}
            </button>
          </div>
        </div>
      ) : (
        <div className="constancia-locked-body">
          <span className="material-icons-round constancia-locked-icon">assignment_late</span>
          <h2>{faltantesTitulo}</h2>
          <p className="constancia-locked-sub">Completa {faltantesTexto} para obtener tu constancia.</p>
        </div>
      )}

      {showEncuestaAlert && (
        <div className="modal-overlay" onClick={() => setShowEncuestaAlert(false)}>
          <div className="modal-locked-card" onClick={(e) => e.stopPropagation()}>
            <span className="material-icons-round modal-alert-icon">assignment_late</span>
            <h3>{faltantesTitulo}</h3>
            <p>Debes completar {faltantesTexto} para poder generar tu constancia.</p>
            <button className="modal-close-btn" onClick={onGoToEncuesta}>
              {faltantes.length === 2 ? 'Ir a las encuestas' : 'Ir a la encuesta'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Constancia;
