import React, { useState, useEffect } from 'react';
import './PreguntasPonentes.css';
import { conferenciasData } from './conferenciasData';

function PreguntasPonentes() {
  const [selectedConfId, setSelectedConfId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllQuestions = async () => {
    if (!selectedConfId) return;
    try {
      // Calling the same API but WITHOUT id_unico to get everything
      const response = await fetch(`/api/preguntas/${selectedConfId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuestions(data.preguntas);
        }
      }
    } catch (e) {
      console.error("Error fetching all questions:", e);
    }
  };

  useEffect(() => {
    if (selectedConfId) {
      setLoading(true);
      fetchAllQuestions().finally(() => setLoading(false));
      
      const interval = setInterval(() => {
        fetchAllQuestions();
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setQuestions([]);
    }
  }, [selectedConfId]);

  if (!selectedConfId) {
    return (
      <div className="ponentes-container animate-fade-in">
        <div className="qa-header-area">
          <div className="qa-header-text">
            <h1>Panel de Ponentes</h1>
            <div className="qa-header-subtitle">
              <span className="material-icons-round">analytics</span>
              <span>LISTADO GLOBAL DE PREGUNTAS</span>
            </div>
          </div>
        </div>

        <div className="ponentes-content">
          <h2 className="v-list-title">Selecciona una sesión</h2>
          <p className="v-list-desc">Elige la conferencia para ver las preguntas que el público está enviando.</p>
          
          <div className="v-conf-list">
            {conferenciasData.filter(c => c.ponentes && c.ponentes.length > 0).map(conf => (
              <div key={conf.id} className="v-conf-item" onClick={() => setSelectedConfId(conf.id)}>
                <div className="v-conf-icon" style={{ background: 'rgba(0, 143, 180, 0.15)', color: '#008fb4' }}>
                  <span className="material-icons-round">forum</span>
                </div>
                <div className="v-conf-info">
                  <h3>{conf.titulo}</h3>
                  <span style={{color: 'rgba(255,255,255,0.6)'}}>
                    {conf.ponentes[0]?.nombre} {conf.ponentes.length > 1 ? 'y otros' : ''}
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

  const conf = conferenciasData.find(c => c.id === selectedConfId);

  return (
    <div className="ponentes-container animate-fade-in">
      <div className="qa-header-area">
        <div className="qa-header-text">
           <h1>Preguntas Recibidas</h1>
           <div className="qa-header-subtitle">
             <span className="material-icons-round">mic</span>
             <span>SESIÓN: {conf?.titulo}</span>
           </div>
        </div>
        <div className="qa-back-btn" onClick={() => setSelectedConfId(null)}>
           <span className="material-icons-round">close</span>
        </div>
      </div>

      <div className="ponentes-list-wrapper">
        <div className="qa-section-header">
          <span className="qa-section-title">FLUJO EN VIVO</span>
          <div className="qa-section-line"></div>
        </div>

        <div className="ponentes-grid">
          {questions.length === 0 ? (
            <div className="qa-empty-state" style={{ marginTop: '40px' }}>
              <span className="material-icons-round" style={{ fontSize: '48px', color: 'rgba(255,255,255,0.1)'}}>hourglass_empty</span>
              <p>Esperando preguntas de los asistentes...</p>
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id || idx} className="qa-card-glass ponente-card">
                <div className="qa-card-header">
                  <div className="qa-status-badge">
                   #{questions.length - idx}
                  </div>
                  <div className="ponente-user-tag">
                    {q.nombre}
                  </div>
                </div>
                <div className="qa-card-body">
                  <p className="ponente-question-text">{q.pregunta}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PreguntasPonentes;
