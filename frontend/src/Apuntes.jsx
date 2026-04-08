import { useState, useEffect, useRef } from 'react';
import './Apuntes.css';
import { agendaEvents } from './agendaData.js';

function Apuntes({ onBack, agente }) {
  const [activeSessionId, setActiveSessionId] = useState(agendaEvents[0].id);
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState('');
  
  // Ref para saber si es el primer render y evitar un "Guardado" al inicio
  const isFirstRender = useRef(true);
  const isCargandoNota = useRef(false);

  // Encontrar el evento activo
  const activeEvent = agendaEvents.find(e => e.id === activeSessionId);

  // Fetch initial note content when session or agent changes
  useEffect(() => {
    const fetchNote = async () => {
      if (!agente?.id) return;
      
      isCargandoNota.current = true;
      setIsSaving('Cargando...');
      try {
        const response = await fetch(`/api/apunte/${agente.id}/${activeSessionId}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setNoteContent(data.contenido || '');
        } else {
          setNoteContent('');
        }
      } catch (error) {
        console.error("Error al cargar apuntes", error);
        setNoteContent('');
      } finally {
        setIsSaving('');
        // Usamos un ligero delay para que el hook de "Guardado" no se dispare
        setTimeout(() => { isCargandoNota.current = false; }, 500);
      }
    };

    fetchNote();
  }, [activeSessionId, agente]);

  // Simulación de Auto-Guardado y Sincronización (Debounce)
  useEffect(() => {
    // Si acaba de montar el componente o se están descargando las notas de la BD, no dispares auto-guardado
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_unico: agente.id,
            session_id: activeSessionId,
            contenido: noteContent
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setIsSaving('Guardado en la nube');
          setTimeout(() => setIsSaving(''), 2000);
        } else {
          setIsSaving('Error al guardar');
        }
      } catch (error) {
        console.error("Fallo guardado en la nube", error);
        setIsSaving('Error al guardar');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [noteContent, activeSessionId, agente]);

  // Al cambiar la sesión
  const handleSessionChange = (e) => {
    setActiveSessionId(e.target.value);
    // El 'useEffect' para el fetch de notas se activará solo
  };

  // Descargar PDF
  const handleDownloadPdf = () => {
    if (!agente?.id) return;
    setIsSaving('Generando PDF...');
    // Simple window.open will trigger the browser's download manager
    // thanks to our 'attachment' header in the backend
    window.open(`/api/apunte/${agente.id}/pdf`, '_blank');
    
    setTimeout(() => setIsSaving(''), 2000);
  };

  // Calcular palabras de forma sencilla
  const wordCount = noteContent.trim() === '' ? 0 : noteContent.trim().split(/\s+/).length;

  return (
    <div className="apuntes-container animate-fade-in">
      {/* Header Info (Similar to Agenda but says Apuntes) */}
      <div className="perfil-header-area">
        <div className="perfil-header-text">
          <h1>Apuntes</h1>
          <div className="perfil-header-subtitle">
            <span className="material-icons-round">event_note</span>
            <span>IO SUMMIT 2026 • Playa del Carmen</span>
          </div>
        </div>
        <div className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Note Editor Area */}
      <div className="note-editor-card">
        {/* Editor Top Bar */}
        <div className="editor-top-bar">
          <div className="editor-session-info">
            <select 
              className="editor-session-dropdown"
              value={activeSessionId}
              onChange={handleSessionChange}
            >
              {agendaEvents.map(event => (
                <option key={event.id} value={event.id}>
                  {event.day}: {event.module ? `${event.module} - ` : ''}{event.title.substring(0, 40)}{event.title.length > 40 ? '...' : ''}
                </option>
              ))}
            </select>
            <p className="editor-session-details">
              {activeEvent?.details} 
              {isSaving && <span className="saving-indicator">{isSaving}</span>}
            </p>
          </div>
          <div className="editor-more-options">
            <span className="material-icons-round">more_horiz</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="editor-textarea-container">
          <textarea 
            className="editor-textarea" 
            placeholder="Captura tus reflexiones aquí..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          ></textarea>
        </div>

        {/* Editor Bottom Bar (Formatting Options) */}
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

      {/* Export to PDF Banner */}
      <div className="export-banner" onClick={handleDownloadPdf} style={{cursor: 'pointer'}}>
        <div className="export-icon-container">
          <span className="material-icons-round export-icon">picture_as_pdf</span>
        </div>
        <div className="export-text-content">
          <h3>Descargar Libreta</h3>
          <p>Exporta todas tus sesiones a un<br/>documento PDF estructurado.</p>
        </div>
        <div className="export-action">
          <span className="export-link">Descargar ahora</span>
        </div>
      </div>

    </div>
  );
}

export default Apuntes;
