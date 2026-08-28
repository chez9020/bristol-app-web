import React, { useState, useEffect } from 'react';
import './Agenda.css';
import './PreguntasPonentes.css';
import { conferenciasData } from './conferenciasData';

function PreguntasPonentes() {
  const [selectedConfId, setSelectedConfId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedConfId) {
      setQuestions([]);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchAllQuestions = async () => {
      try {
        // Mismo endpoint que Interacciones pero SIN id_unico: devuelve todas las preguntas
        const response = await fetch(`/api/preguntas/${selectedConfId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (cancelled) return;
        if (data.success) {
          setQuestions(data.preguntas);
          setError(null);
        } else {
          setError('No se pudieron cargar las preguntas.');
        }
      } catch {
        if (!cancelled) setError('Sin conexión con el servidor. Reintentando…');
      }
    };

    setLoading(true);
    fetchAllQuestions().finally(() => {
      if (!cancelled) setLoading(false);
    });

    const interval = setInterval(fetchAllQuestions, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedConfId]);

  const toggleStatus = async (questionId, currentStatus) => {
    // Optimista: la UI responde ya, el poll de 5s reconcilia
    setQuestions(prev => prev.map(q => (q.id === questionId ? { ...q, respondida: !currentStatus } : q)));
    try {
      const response = await fetch(`/api/pregunta/${selectedConfId}/${questionId}/respondida`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respondida: !currentStatus }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch {
      setQuestions(prev => prev.map(q => (q.id === questionId ? { ...q, respondida: currentStatus } : q)));
      setError('No se pudo actualizar el estado de la pregunta.');
    }
  };

  if (!selectedConfId) {
    const sesiones = conferenciasData.filter(c => c.ponentes && c.ponentes.length > 0);
    return (
      <div className="qp-container animate-fade-in">
        <header className="agenda-header">
          <div className="agenda-header-text">
            <h1>Panel de Ponentes</h1>
            <div className="agenda-subtitle">
              <span className="material-icons-round">analytics</span>
              <span>LISTADO GLOBAL DE PREGUNTAS</span>
            </div>
          </div>
        </header>

        <div className="qp-body">
          <h2 className="qp-list-title">Selecciona una sesión</h2>
          <p className="qp-list-desc">Elige la conferencia para ver las preguntas que el público está enviando.</p>

          <div className="qp-conf-list">
            {sesiones.map(conf => (
              <div
                key={conf.id}
                className="qp-conf-item"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedConfId(conf.id)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedConfId(conf.id); }}
              >
                <div className="qp-conf-icon">
                  <span className="material-icons-round">forum</span>
                </div>
                <div className="qp-conf-info">
                  <h3>{conf.titulo}</h3>
                  <span>
                    {conf.ponentes[0]?.nombre}{conf.ponentes.length > 1 ? ' y otros' : ''}
                  </span>
                </div>
                <span className="material-icons-round qp-conf-chevron">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const conf = conferenciasData.find(c => c.id === selectedConfId);

  // Pendientes primero, respondidas al final
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.respondida === b.respondida) return 0;
    return a.respondida ? 1 : -1;
  });
  const pendientes = questions.filter(q => !q.respondida).length;

  return (
    <div className="qp-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Preguntas Recibidas</h1>
          <div className="agenda-subtitle">
            <span className="material-icons-round">mic</span>
            <span>{conf?.titulo}</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={() => setSelectedConfId(null)}>
          <span className="material-icons-round" style={{ color: 'white' }}>close</span>
        </div>
      </header>

      <div className="qp-body">
        <div className="qp-section-header">
          <span className="qp-section-title">Flujo en vivo</span>
          <span className="qp-live-dot"></span>
          <div className="qp-section-line"></div>
          <span className="qp-counter">{pendientes} pendiente{pendientes === 1 ? '' : 's'}</span>
        </div>

        {error && <p className="qp-error">{error}</p>}

        <div className="qp-grid">
          {loading && questions.length === 0 ? (
            <div className="qp-empty-state">
              <span className="material-icons-round">sync</span>
              <p>Cargando preguntas…</p>
            </div>
          ) : sortedQuestions.length === 0 ? (
            <div className="qp-empty-state">
              <span className="material-icons-round">hourglass_empty</span>
              <p>Esperando preguntas de los asistentes…</p>
            </div>
          ) : (
            sortedQuestions.map((q, idx) => (
              <div key={q.id || idx} className={`qp-card ${q.respondida ? 'is-answered' : ''}`}>
                <div className="qp-card-header">
                  <div className="qp-status-badge">#{idx + 1}</div>
                  <div className="qp-user-tag">{q.nombre}</div>
                  <button
                    type="button"
                    className={`qp-check-btn ${q.respondida ? 'checked' : ''}`}
                    title={q.respondida ? 'Marcar como pendiente' : 'Marcar como respondida'}
                    aria-label={q.respondida ? 'Marcar como pendiente' : 'Marcar como respondida'}
                    onClick={() => toggleStatus(q.id, q.respondida)}
                  >
                    <span className="material-icons-round">
                      {q.respondida ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </button>
                </div>
                <div className="qp-card-body">
                  <p className="qp-question-text">{q.pregunta}</p>
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
