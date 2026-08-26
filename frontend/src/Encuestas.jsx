import React, { useState, useEffect } from 'react';
import './Agenda.css';
import './Encuestas.css';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { marcarEncuestaCompletada } from './encuestaSalida';

const RATING_QUESTIONS = [
  { id: 'q1', text: '¿Cómo calificaría la relevancia científica del contenido presentado en el evento Blood?' },
  { id: 'q2', text: '¿Qué tan útil considera la información presentada para su práctica clínica o toma de decisiones médicas?' },
  { id: 'q3', text: '¿Cómo evaluaría la calidad y claridad de las presentaciones de los ponentes?' },
  { id: 'q4', text: '¿Qué tan satisfecho/a quedó con la profundidad con la que se abordaron los temas?' },
  { id: 'q5', text: '¿Cómo calificaría su experiencia general del evento Blood?' },
  { id: 'q6', text: '¿Cómo calificaría la plática/taller de IA?' },
];

const OPEN_QUESTION = { id: 'q7', text: '¿Le gustaría que continuáramos con estos talleres de IA con algún tema en específico?' };

function StarRating({ value, onChange }) {
  return (
    <div className="encuesta-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`encuesta-star-btn ${n <= value ? 'filled' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} estrellas`}
        >
          <span className="material-icons-round">{n <= value ? 'star' : 'star_border'}</span>
        </button>
      ))}
    </div>
  );
}

function Encuestas({ onBack, agente }) {
  const [checkingPrev, setCheckingPrev] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const checkPrevious = async () => {
      if (!agente?.id) { setCheckingPrev(false); return; }
      try {
        const q = query(collection(db, 'encuestas_resultados'), where('agente_id', '==', agente.id));
        const snap = await getDocs(q);
        if (!snap.empty) {
          marcarEncuestaCompletada(agente.id);
          setAlreadyCompleted(true);
        }
      } catch (e) {
        console.warn('No se pudo verificar encuesta previa:', e.message);
      } finally {
        setCheckingPrev(false);
      }
    };
    checkPrevious();
  }, [agente?.id]);

  const isValid = RATING_QUESTIONS.every((q) => ratings[q.id]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'encuestas_resultados'), {
        agente_id: agente?.id || 'unknown',
        nombre: agente?.nombre || 'Invitado',
        respuestas: ratings,
        comentario_abierto: comentario,
        fecha: serverTimestamp(),
        proyecto: 'Blood 2026',
      });
      marcarEncuestaCompletada(agente?.id);
      setDone(true);
    } catch (error) {
      console.error('Error al guardar encuesta:', error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const header = (
    <header className="agenda-header">
      <div className="agenda-header-text">
        <h1>Encuesta de salida</h1>
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
      <div className="encuestas-container animate-fade-in">
        {header}
        <div className="checking-screen">
          <div className="checking-spinner"></div>
          <p>Verificando...</p>
        </div>
      </div>
    );
  }

  if (alreadyCompleted || done) {
    return (
      <div className="encuestas-container animate-fade-in">
        {header}
        <div className="encuesta-done-screen animate-fade-in">
          <span className="material-icons-round encuesta-done-icon">check_circle</span>
          <h3>¡Gracias por tu opinión!</h3>
          <p>Ya registramos tu encuesta de salida.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="encuestas-container animate-fade-in">
      {header}

      {RATING_QUESTIONS.map((q) => (
        <div className="encuesta-poll-card" key={q.id}>
          <h3 className="encuesta-question-text">{q.text}</h3>
          <StarRating value={ratings[q.id] || 0} onChange={(v) => setRatings((prev) => ({ ...prev, [q.id]: v }))} />
        </div>
      ))}

      <div className="encuesta-poll-card">
        <h3 className="encuesta-question-text">{OPEN_QUESTION.text}</h3>
        <textarea
          className="encuesta-textarea"
          placeholder="Escribe aquí tu respuesta..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
      </div>

      <button
        className="encuesta-btn-siguiente"
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar encuesta'}
      </button>
    </div>
  );
}

export default Encuestas;
