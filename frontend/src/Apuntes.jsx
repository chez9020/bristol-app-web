import React, { useState, useEffect, useRef } from 'react';
import './Apuntes.css';
import { agendaEvents } from './agendaData.js';

function Apuntes({ onBack, agente }) {
  const [activeSessionId, setActiveSessionId] = useState(agendaEvents[0]?.id || '');
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState('');
  
  const isFirstRender = useRef(true);
  const isCargandoNota = useRef(false);

  // Encontrar el evento activo
  const activeEvent = agendaEvents.find(e => e.id === activeSessionId);

  // Fetch initial note content
  useEffect(() => {
    const fetchNote = async () => {
      if (!agente?.id || !activeSessionId) return;
      isCargandoNota.current = true;
      setIsSaving('Cargando...');
      try {
        const response = await fetch(`/api/apunte/${agente.id}/${activeSessionId}`);
        const data = await response.json();
        setNoteContent((response.ok && data.success) ? data.contenido : '');
      } catch (error) {
        console.error("Error al cargar apuntes", error);
        setNoteContent('');
      } finally {
        setIsSaving('');
        setTimeout(() => { isCargandoNota.current = false; }, 500);
      }
    };
    fetchNote();
  }, [activeSessionId, agente]);

  // Auto-Guardado (Debounce)
  useEffect(() => {
    if (isFirstRender.current || isCargandoNota.current) {
      isFirstRender.current = false;
      return;
    }
    setIsSaving('Guardando...');
    const timer = setTimeout(async () => {
      if (!agente?.id) return;
      try {
        const response = await fetch('/api/apunte', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_unico: agente.id,
            session_id: activeSessionId,
            contenido: noteContent
          }),
        });
        if (response.ok) setIsSaving('Guardado');
        setTimeout(() => setIsSaving(''), 2000);
      } catch (error) {
        setIsSaving('Error al guardar');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [noteContent, activeSessionId, agente]);

  const handleDownloadPdf = () => {
    if (!agente?.id) return;
    window.open(`/api/apunte/${agente.id}/pdf`, '_blank');
  };

  const wordCount = noteContent.trim() === '' ? 0 : noteContent.trim().split(/\s+/).length;

  return (
    <div className="apuntes-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Apuntes</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>event_note</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="note-editor-card">
        <div className="editor-top-bar">
          <div className="editor-session-info">
            <select 
              className="editor-session-dropdown"
              value={activeSessionId}
              onChange={(e) => setActiveSessionId(e.target.value)}
            >
              {agendaEvents.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title.toUpperCase()}
                </option>
              ))}
            </select>
            <p className="editor-session-details">
              {activeEvent?.time} {activeEvent?.room ? `• ${activeEvent.room}` : ''}
              {isSaving && <span className="saving-indicator-float"> — {isSaving}</span>}
            </p>
          </div>
          <span className="material-icons-round editor-more-icon">more_horiz</span>
        </div>

        <div className="editor-textarea-container">
          <textarea 
            className="editor-textarea" 
            placeholder="Captura tus reflexiones aquí..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
        </div>

        <div className="editor-bottom-bar">
          <div className="editor-format-tools">
            <button className="format-btn"><span className="material-icons-round">format_bold</span></button>
            <button className="format-btn"><span className="material-icons-round">format_italic</span></button>
            <button className="format-btn"><span className="material-icons-round">format_list_bulleted</span></button>
            <div className="format-divider"></div>
            <button className="format-btn"><span className="material-icons-round">check_box</span></button>
          </div>
          <div className="editor-word-count">
            {wordCount} palabras
          </div>
        </div>
      </div>

      <div className="export-email-card">
        <div className="export-email-icon-box">
          <span className="material-icons-round">mail</span>
        </div>
        <div className="export-email-text">
          <h3>¿Necesitas una copia?</h3>
          <p>Exporta todas las sesiones a tu<br/>correo electrónico registrado.</p>
        </div>
        <button className="btn-send-email" onClick={handleDownloadPdf}>
          Enviar ahora
        </button>
      </div>

    </div>
  );
}

export default Apuntes;
