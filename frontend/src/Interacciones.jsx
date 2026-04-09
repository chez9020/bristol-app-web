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

  const userId = agente?.id || 'USER_DEMO_123';

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
      alert("Pregunta enviada exitosamente.");
      fetchQuestions(); // Refresh list immediately after posting
    } catch (e) {
      console.error("Error sending question:", e);
      alert("Error al enviar la pregunta.");
    } finally {
      setIsSubmitting(false);
    }
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
                    {/* Visual placeholders for edit/delete as per design */}
                    <span className="material-icons-round">edit</span>
                    <span className="material-icons-round">delete_outline</span>
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
    </div>
  );
}

export default Interacciones;

