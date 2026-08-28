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
];

const OPCIONES_Q5 = [
  'De gran valor al acelerar aprobación de nuevos fármacos.',
  'De valor, porque EMR es un subrogado de SLP.',
  'Es importante, pero preferiría ver los datos de SLP.',
  'Indistinto, considero que la EMR no tiene relevancia clínica.',
  'Otro',
];

const Q5 = {
  id: 'q5',
  text: '¿Qué opinión tiene sobre la aprobación por parte de la FDA de iberdomida con base en EMR?',
};

const PROB_SCALE = 'Escala: 1 = Nada probable | 2 = Poco probable | 3 = Moderadamente probable | 4 = Muy probable | 5 = Extremadamente probable';

const PROB_QUESTIONS = [
  { id: 'q6', text: '¿Con la información que recibió, qué tan probable sería que utilizara iberdomida en combinación con daratumumab y dexametasona en pacientes con mieloma múltiple en recaída/refractario (MMRR)?' },
  { id: 'q7', text: '¿Con la información que recibió, qué tan probable sería que utilizara mezigdomida en combinación con carfilzomib o bortezomib y dexametasona en pacientes con mieloma múltiple en recaída/refractario (MMRR)?' },
];

const Q8 = {
  id: 'q8',
  text: '¿Considera que los CELMoDs y los IMiDs son clases terapéuticas diferentes?',
};

const OPCIONES_Q9 = [
  'Pacientes refractarios a lenalidomida',
  'Pacientes expuestos a anti-CD38',
  'Pacientes triple-clase expuestos',
  'Pacientes con recaída temprana',
  'Pacientes con citopenias asociadas al tratamiento',
  'Pacientes no candidatos a terapias celulares',
];

const Q9 = {
  id: 'q9',
  text: 'Seleccione 3 escenarios clínicos en los que considera que la terapia con CELMoD sería más útil:',
};

const MULTI_MAX = 3;

const Q10 = { id: 'q10', text: '¿Cómo calificaría su experiencia general del evento Blood?' };

const OPEN_QUESTION = { id: 'q11', text: 'Si deseas comentar algo, puedes hacerlo en el siguiente espacio:' };

const STEP_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11'];

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
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState({});
  const [q5Opcion, setQ5Opcion] = useState('');
  const [q5Otro, setQ5Otro] = useState('');
  const [q8Valor, setQ8Valor] = useState('');
  const [q8Explicacion, setQ8Explicacion] = useState('');
  const [q9Seleccion, setQ9Seleccion] = useState([]);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const checkPrevious = async () => {
      if (!agente?.id) { setCheckingPrev(false); return; }
      try {
        const q = query(
          collection(db, 'encuestas_resultados'),
          where('agente_id', '==', agente.id),
          where('proyecto', '==', 'Blood 2026')
        );
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

  const toggleQ9 = (opcion) => {
    setQ9Seleccion((prev) => {
      if (prev.includes(opcion)) return prev.filter((o) => o !== opcion);
      if (prev.length >= MULTI_MAX) return prev;
      return [...prev, opcion];
    });
  };

  const stepValid = (id) => {
    if (id === 'q5') return q5Opcion && (q5Opcion !== 'Otro' || q5Otro.trim());
    if (id === 'q8') return q8Valor && (q8Valor !== 'No' || q8Explicacion.trim());
    if (id === 'q9') return q9Seleccion.length === MULTI_MAX;
    if (id === 'q11') return true;
    return !!ratings[id];
  };

  const currentId = STEP_IDS[step];
  const isLastStep = step === STEP_IDS.length - 1;
  const canAdvance = stepValid(currentId);

  const handleSubmit = async () => {
    if (!canAdvance) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'encuestas_resultados'), {
        agente_id: agente?.id || 'unknown',
        nombre: agente?.nombre || 'Invitado',
        respuestas: {
          ...ratings,
          q5: { opcion: q5Opcion, otro: q5Opcion === 'Otro' ? q5Otro.trim() : '' },
          q8: { valor: q8Valor, explicacion: q8Valor === 'No' ? q8Explicacion.trim() : '' },
          q9: q9Seleccion,
        },
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

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLastStep) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
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

  const renderStep = () => {
    if (currentId === 'q5') {
      return (
        <div className="encuesta-poll-card" key={Q5.id}>
          <h3 className="encuesta-question-text">{Q5.text}</h3>
          <div className="encuesta-options">
            {OPCIONES_Q5.map((op) => (
              <div
                key={op}
                className={`encuesta-option-pill ${q5Opcion === op ? 'selected' : ''}`}
                onClick={() => setQ5Opcion(op)}
              >
                {op}
              </div>
            ))}
          </div>
          {q5Opcion === 'Otro' && (
            <textarea
              className="encuesta-textarea encuesta-condicional"
              placeholder="En caso de contestar “Otro”, por favor mencione cuál:"
              value={q5Otro}
              onChange={(e) => setQ5Otro(e.target.value)}
            />
          )}
        </div>
      );
    }

    if (currentId === 'q8') {
      return (
        <div className="encuesta-poll-card" key={Q8.id}>
          <h3 className="encuesta-question-text">{Q8.text}</h3>
          <div className="encuesta-options encuesta-options-row">
            {['Sí', 'No'].map((op) => (
              <div
                key={op}
                className={`encuesta-option-pill encuesta-option-pill-yn ${q8Valor === op ? 'selected' : ''}`}
                onClick={() => setQ8Valor(op)}
              >
                {op}
              </div>
            ))}
          </div>
          {q8Valor === 'No' && (
            <textarea
              className="encuesta-textarea encuesta-condicional"
              placeholder="Por favor explique:"
              value={q8Explicacion}
              onChange={(e) => setQ8Explicacion(e.target.value)}
            />
          )}
        </div>
      );
    }

    if (currentId === 'q9') {
      return (
        <div className="encuesta-poll-card" key={Q9.id}>
          <h3 className="encuesta-question-text">{Q9.text}</h3>
          <div className="encuesta-options">
            {OPCIONES_Q9.map((op) => {
              const checked = q9Seleccion.includes(op);
              const disabled = !checked && q9Seleccion.length >= MULTI_MAX;
              return (
                <div
                  key={op}
                  className={`encuesta-option-pill encuesta-option-check ${checked ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                  onClick={() => !disabled && toggleQ9(op)}
                >
                  <span className="material-icons-round">{checked ? 'check_box' : 'check_box_outline_blank'}</span>
                  {op}
                </div>
              );
            })}
          </div>
          <p className="encuesta-escala">{q9Seleccion.length}/{MULTI_MAX} seleccionadas</p>
        </div>
      );
    }

    if (currentId === 'q11') {
      return (
        <div className="encuesta-poll-card" key={OPEN_QUESTION.id}>
          <h3 className="encuesta-question-text">{OPEN_QUESTION.text}</h3>
          <textarea
            className="encuesta-textarea"
            placeholder="Escribe aquí tu respuesta... (opcional)"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>
      );
    }

    const probQuestion = PROB_QUESTIONS.find((q) => q.id === currentId);
    const question = probQuestion || RATING_QUESTIONS.find((q) => q.id === currentId) || Q10;

    return (
      <div className="encuesta-poll-card" key={question.id}>
        <h3 className="encuesta-question-text">{question.text}</h3>
        <StarRating value={ratings[question.id] || 0} onChange={(v) => setRatings((prev) => ({ ...prev, [question.id]: v }))} />
        {probQuestion && <p className="encuesta-escala">{PROB_SCALE}</p>}
      </div>
    );
  };

  return (
    <div className="encuestas-container animate-fade-in">
      {header}

      {step === 0 && (
        <p className="encuesta-intro">Gracias por asistir a BLOOD 2026, tu opinión es muy importante para nosotros, ayúdanos contestando las siguientes preguntas:</p>
      )}

      <p className="encuesta-progreso">Pregunta {step + 1} de {STEP_IDS.length}</p>

      {renderStep()}

      <div className="encuesta-nav">
        {step > 0 && (
          <button className="encuesta-btn-anterior" onClick={() => setStep((s) => s - 1)}>
            Anterior
          </button>
        )}
        <button
          className="encuesta-btn-siguiente"
          onClick={handleNext}
          disabled={!canAdvance || isSubmitting}
        >
          {isLastStep ? (isSubmitting ? 'Enviando...' : 'Enviar encuesta') : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}

export default Encuestas;
