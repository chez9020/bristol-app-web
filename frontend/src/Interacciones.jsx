import React, { useState, useEffect } from 'react';
import './Agenda.css';
import './Interacciones.css';
import { conferenciasData } from './conferenciasData';

function Interacciones({ onBack, agente }) {
  const [selectedConfId, setSelectedConfId] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [modal, setModal] = useState({
    show: false,
    title: '',
    text: '',
    type: 'alert', // alert, confirm, edit
    onConfirm: null,
    inputValue: ''
  });

  const userId = agente?.id || 'USER_DEMO_123';

  const showModal = (title, text, type = 'alert', onConfirm = null, initialInput = '') => {
    setModal({
      show: true,
      title,
      text,
      type,
      onConfirm,
      inputValue: initialInput
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

  const fetchQuestions = async () => {
    if (!selectedConfId) return;
    try {
      const response = await fetch(`/api/preguntas/${selectedConfId}?id_unico=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuestions(data.preguntas);
        }
      }
    } catch (e) {
      console.error("Error fetching questions via API:", e);
    }
  };

  // Fetch questions when opening conference and poll to keep it live
  useEffect(() => {
    if (!selectedConfId) {
      setQuestions([]);
      return;
    }

    fetchQuestions();

    const interval = setInterval(() => {
      fetchQuestions();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConfId, userId]);

  const handleSendQuestion = async () => {
    if (!questionText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Use the explicit backend endpoint configured in main.py to bypass standard firestore web rules
      const response = await fetch('/api/pregunta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_unico: userId.toString(),
          session_id: selectedConfId.toString(),
          pregunta: questionText.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Error en el servidor al guardar la pregunta');
      }

      setQuestionText('');
      showModal("¡Éxito!", "Pregunta enviada exitosamente.");
      fetchQuestions(); // Refresh list immediately after posting
    } catch (e) {
      console.error("Error sending question:", e);
      showModal("Error", "No se pudo enviar la pregunta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditQuestion = (qId, currentText) => {
    showModal(
      "Editar Pregunta",
      "Corrige tu pregunta a continuación:",
      'edit',
      async (newText) => {
        try {
          const response = await fetch(`/api/pregunta/${selectedConfId}/${qId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pregunta: newText.trim() })
          });

          if (response.ok) {
            fetchQuestions();
            closeModal();
          }
        } catch (e) {
          console.error("Error editing question:", e);
          showModal("Error", "No se pudo editar la pregunta.");
        }
      },
      currentText
    );
  };

  const handleDeleteQuestion = (qId) => {
    showModal(
      "¿Eliminar pregunta?",
      "Esta acción no se puede deshacer.",
      'confirm',
      async () => {
        try {
          const response = await fetch(`/api/pregunta/${selectedConfId}/${qId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            fetchQuestions();
            closeModal();
          }
        } catch (e) {
          console.error("Error deleting question:", e);
          showModal("Error", "No se pudo eliminar la pregunta.");
        }
      }
    );
  };

  // ─── STATE 1: List Conferences ───
  if (!selectedConfId) {
    return (
      <div className="interacciones-container animate-fade-in">
        <header className="agenda-header">
          <div className="agenda-header-text">
            <h1>Preguntas</h1>
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

        <div className="ia-content">
          <h2 className="ia-list-title">Selecciona una conferencia</h2>
          <p className="ia-list-desc">Elige la sesión a la que deseas enviar una pregunta al ponente.</p>

          <div className="ia-conf-list">
            {conferenciasData.filter(c => c.ponentes && c.ponentes.length > 0).map(conf => (
              <div key={conf.id} className="ia-conf-item" onClick={() => setSelectedConfId(conf.id)}>
                <div className="ia-conf-icon">
                  <span className="material-icons-round">record_voice_over</span>
                </div>
                <div className="ia-conf-info">
                  <h3>{conf.titulo}</h3>
                  <span>
                    {conf.ponentes.length > 1 ? 'Múltiples Ponentes' : conf.ponentes[0]?.nombre}
                  </span>
                </div>
                <span className="material-icons-round chevron">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── STATE 2: Q&A Interface ───
  return (
    <div className="interacciones-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Preguntas</h1>
          <div className="agenda-subtitle">
            <span className="material-icons-round">event</span>
            <span>BLOOD 2026</span>
          </div>
        </div>
        <img src="/assets/icon_notification_bell.png" alt="" className="agenda-header-bell" />
        <div className="back-btn-circle" onClick={() => setSelectedConfId(null)}>
          <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
        </div>
      </header>

      <div className="ia-content">

        {/* Tus Preguntas Section */}
        <div className="ia-section-header">
          <span className="ia-section-title">Tus preguntas</span>
          <div className="ia-section-line"></div>
        </div>

        <div className="ia-list-container">
          {questions.length === 0 ? (
            <div className="ia-empty-state">
              <span className="material-icons-round" style={{ fontSize: '32px', color: 'rgba(58,53,52,0.2)' }}>chat_bubble_outline</span>
              <p>Aún no has enviado preguntas para esta sesión.</p>
            </div>
          ) : (
            questions.map(q => (
              <div key={q.id} className={`ia-card ${q.respondida ? 'is-resolved' : ''}`}>
                <div className="ia-card-header">
                  <div className={`ia-status-badge ${q.respondida ? 'status-green' : ''}`}>
                    <span className="material-icons-round">
                      {q.respondida ? 'check_circle' : 'hourglass_top'}
                    </span>
                    {q.respondida ? 'RESUELTA' : 'ENVIADA'}
                  </div>
                  {!q.respondida && (
                    <div className="ia-card-actions">
                      <span
                        className="material-icons-round"
                        onClick={() => handleEditQuestion(q.id, q.pregunta)}
                      >edit</span>
                      <span
                        className="material-icons-round"
                        onClick={() => handleDeleteQuestion(q.id)}
                      >delete_outline</span>
                    </div>
                  )}
                </div>
                <div className="ia-card-body">
                  <p>{q.pregunta}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="ia-input-area">
          <div className="ia-input-glass">
            <textarea
              placeholder="Escribe tu pregunta aquí"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="ia-textarea"
              maxLength={300}
            ></textarea>
          </div>

          <button
            className="ia-send-btn"
            onClick={handleSendQuestion}
            disabled={isSubmitting || !questionText.trim()}
          >
            <span className="material-icons-round">send</span>
            <span>{isSubmitting ? 'Enviando...' : 'Enviar pregunta'}</span>
          </button>

          <div className="ia-disclaimer">
            <p>Tus preguntas podrán ser revisadas por el ponente durante o después del evento.</p>
          </div>
        </div>

      </div>

      {/* --- CUSTOM PREMIUM MODAL --- */}
      {modal.show && (
        <div className="ia-modal-overlay">
          <div className="ia-modal-content">
            <div className="ia-modal-icon-box">
              <span className="material-icons-round">
                {modal.type === 'confirm' ? 'help_outline' : modal.type === 'edit' ? 'edit' : 'info_outline'}
              </span>
            </div>

            <h3 className="ia-modal-title">{modal.title}</h3>
            <p className="ia-modal-text">{modal.text}</p>

            {modal.type === 'edit' && (
              <div className="ia-modal-input-container">
                <textarea
                  className="ia-modal-input"
                  value={modal.inputValue}
                  onChange={(e) => setModal(prev => ({ ...prev, inputValue: e.target.value }))}
                />
              </div>
            )}

            <div className="ia-modal-footer">
              {modal.type !== 'alert' && (
                <button className="ia-btn-modal-secondary" onClick={closeModal}>
                  Cancelar
                </button>
              )}
              <button
                className="ia-btn-modal-primary"
                onClick={() => {
                  if (modal.type === 'edit') {
                    modal.onConfirm(modal.inputValue);
                  } else if (modal.onConfirm) {
                    modal.onConfirm();
                  } else {
                    closeModal();
                  }
                }}
              >
                {modal.type === 'confirm' ? 'Eliminar' : modal.type === 'edit' ? 'Guardar' : 'Entendido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interacciones;
