import React, { useState, useEffect } from 'react';
import './Interacciones.css';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
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
      <div className="votaciones-container animate-fade-in">
        <div className="qa-header-area">
          <div className="qa-header-text">
            <h1>Preguntas</h1>
            <div className="qa-header-subtitle">
              <span className="material-icons-round">event</span>
              <span>CAMZYOS® • Cancún</span>
            </div>
          </div>
          <div className="qa-back-btn" onClick={onBack}>
            <span className="material-icons-round">chevron_left</span>
          </div>
        </div>

        <div className="v-section-container">
          <h2 className="v-list-title">Selecciona una conferencia</h2>
          <p className="v-list-desc">Elige la sesión a la que deseas enviar una pregunta al ponente.</p>
          
          <div className="v-conf-list">
            {conferenciasData.filter(c => c.ponentes && c.ponentes.length > 0).map(conf => (
              <div key={conf.id} className="v-conf-item" onClick={() => setSelectedConfId(conf.id)}>
                <div className="v-conf-icon" style={{ background: 'rgba(131, 71, 173, 0.15)', color: '#8347ad' }}>
                  <span className="material-icons-round">record_voice_over</span>
                </div>
                <div className="v-conf-info">
                  <h3>{conf.titulo}</h3>
                  <span style={{color: 'rgba(255,255,255,0.6)'}}>
                    {conf.ponentes.length > 1 ? 'Múltiples Ponentes' : conf.ponentes[0]?.nombre}
                  </span>
                </div>
                <span className="material-icons-round" style={{ color: 'rgba(255,255,255,0.3)' }}>chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── STATE 2: Q&A Interface ───
  const conf = conferenciasData.find(c => c.id === selectedConfId);

  return (
    <div className="votaciones-container animate-fade-in">
      <div className="qa-header-area">
        <div className="qa-header-text">
           <h1>Preguntas</h1>
           <div className="qa-header-subtitle">
             <span className="material-icons-round">event</span>
             <span>CAMZYOS® • Cancún</span>
           </div>
        </div>
        <div className="qa-back-btn" onClick={() => setSelectedConfId(null)}>
           <span className="material-icons-round">chevron_left</span>
        </div>
      </div>

      <div className="qa-main-wrapper">
        
        {/* Tus Preguntas Section */}
        <div className="qa-section-header">
          <span className="qa-section-title">TUS PREGUNTAS</span>
          <div className="qa-section-line"></div>
        </div>

        <div className="qa-list-container">
          {questions.length === 0 ? (
            <div className="qa-empty-state">
              <span className="material-icons-round" style={{ fontSize: '32px', color: 'rgba(255,255,255,0.2)'}}>chat_bubble_outline</span>
              <p>Aún no has enviado preguntas para esta sesión.</p>
            </div>
          ) : (
            questions.map(q => (
              <div key={q.id} className="qa-card-glass">
                <div className="qa-card-header">
                  <div className="qa-status-badge">
                    <span className="material-icons-round" style={{ fontSize: '12px' }}>check_circle</span>
                    ENVIADA
                  </div>
                  <div className="qa-card-actions">
                    <span 
                      className="material-icons-round" 
                      onClick={() => handleEditQuestion(q.id, q.pregunta)}
                    >edit</span>
                    <span 
                      className="material-icons-round" 
                      onClick={() => handleDeleteQuestion(q.id)}
                    >delete_outline</span>
                  </div>
                </div>
                <div className="qa-card-body">
                  <p>{q.pregunta}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="qa-input-area">
          <div className="qa-input-glass">
            <textarea 
              placeholder="Escribe Tu Pregunta Aquí"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="qa-textarea"
              maxLength={300}
            ></textarea>
          </div>

          <button 
            className="btn-premium-gradient-qa" 
            onClick={handleSendQuestion}
            disabled={isSubmitting || !questionText.trim()}
          >
            <span className="material-icons-round">send</span>
            <span>{isSubmitting ? 'Enviando...' : 'Enviar pregunta'}</span>
          </button>

          <div className="qa-disclaimer">
            <p>Tus preguntas podrán ser revisadas por el ponente durante o después del evento.</p>
          </div>
        </div>

      </div>

      {/* --- CUSTOM PREMIUM MODAL --- */}
      {modal.show && (
        <div className="qa-modal-overlay">
          <div className="qa-modal-content">
            <div className="qa-modal-icon-box">
              <span className="material-icons-round">
                {modal.type === 'confirm' ? 'help_outline' : modal.type === 'edit' ? 'edit' : 'info_outline'}
              </span>
            </div>
            
            <h3 className="qa-modal-title">{modal.title}</h3>
            <p className="qa-modal-text">{modal.text}</p>
            
            {modal.type === 'edit' && (
              <div className="qa-modal-input-container">
                <textarea 
                  className="qa-modal-input"
                  value={modal.inputValue}
                  onChange={(e) => setModal(prev => ({ ...prev, inputValue: e.target.value }))}
                />
              </div>
            )}
            
            <div className="qa-modal-footer">
              {modal.type !== 'alert' && (
                <button className="qa-btn-modal-secondary" onClick={closeModal}>
                  Cancelar
                </button>
              )}
              <button 
                className="qa-btn-modal-primary" 
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

