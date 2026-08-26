import React, { useState, useEffect, useRef } from 'react';
import './Agenda.css';
import './Constancia.css';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { isEncuestaCompletada, marcarEncuestaCompletada } from './encuestaSalida';

function Constancia({ onBack, onGoToEncuesta, agente }) {
  const certCardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(isEncuestaCompletada(agente?.id));
  const [checkingPrev, setCheckingPrev] = useState(true);
  const [showEncuestaAlert, setShowEncuestaAlert] = useState(false);

  const userName = agente?.nombre || 'Invitado';

  useEffect(() => {
    const checkPreviousSubmission = async () => {
      if (!agente?.id) { setCheckingPrev(false); return; }
      if (isEncuestaCompletada(agente.id)) { setSurveyCompleted(true); setCheckingPrev(false); return; }
      try {
        const q = query(
          collection(db, 'encuestas_resultados'),
          where('agente_id', '==', agente.id)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          marcarEncuestaCompletada(agente.id);
          setSurveyCompleted(true);
        }
      } catch (e) {
        console.warn('No se pudo verificar encuesta previa:', e.message);
      } finally {
        setCheckingPrev(false);
      }
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
            <h2 className="cert-figma-nombre">{userName}</h2>
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
          <h2>Encuesta pendiente</h2>
          <p className="constancia-locked-sub">Completa la encuesta de salida para obtener tu constancia.</p>
        </div>
      )}

      {showEncuestaAlert && (
        <div className="modal-overlay" onClick={() => setShowEncuestaAlert(false)}>
          <div className="modal-locked-card" onClick={(e) => e.stopPropagation()}>
            <span className="material-icons-round modal-alert-icon">assignment_late</span>
            <h3>Encuesta pendiente</h3>
            <p>Debes completar la encuesta de salida para poder generar tu constancia.</p>
            <button className="modal-close-btn" onClick={onGoToEncuesta}>
              Ir a la encuesta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Constancia;
