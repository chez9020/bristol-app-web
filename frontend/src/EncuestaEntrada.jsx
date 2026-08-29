import React, { useState, useEffect } from 'react';
import './Agenda.css';
import './Encuestas.css';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { isEncuestaEntradaCompletada } from './encuestaEntrada';
import { marcarContestada } from './encuestasEstado';
import { PREGUNTAS } from './encuestaEntradaPreguntas';


const STEP_IDS = PREGUNTAS.map((p) => p.id);

const otroDe = (pregunta) => pregunta.opciones?.find((o) => o.includes('______'));

const incluyeOtro = (pregunta, valor) => {
  const otro = otroDe(pregunta);
  if (!otro || valor == null) return false;
  if (pregunta.tipo === 'unica_anidada') return valor.opcion === otro;
  if (Array.isArray(valor)) return valor.includes(otro);
  return valor === otro;
};

function EncuestaEntrada({ onBack, agente }) {
  const [checkingPrev, setCheckingPrev] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(isEncuestaEntradaCompletada(agente?.id));
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [otros, setOtros] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const checkPreviousSubmission = async () => {
      if (!agente?.id) { setCheckingPrev(false); return; }
      if (isEncuestaEntradaCompletada(agente.id)) { setAlreadyCompleted(true); setCheckingPrev(false); return; }
      try {
        const q = query(
          collection(db, 'encuesta_entrada_resultados'),
          where('agente_id', '==', agente.id),
          where('proyecto', '==', 'Blood 2026')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          marcarContestada(agente.id, 'entrada');
          setAlreadyCompleted(true);
        }
      } catch (e) {
        console.warn('No se pudo verificar encuesta de entrada previa:', e.message);
      } finally {
        setCheckingPrev(false);
      }
    };
    checkPreviousSubmission();
  }, [agente?.id]);

  const currentId = STEP_IDS[step];
  const pregunta = PREGUNTAS.find((p) => p.id === currentId);
  const isLastStep = step === STEP_IDS.length - 1;

  const stepValid = (p) => {
    const valor = answers[p.id];
    const otro = otroDe(p);
    const otroOk = !otro || !incluyeOtro(p, valor) || (otros[p.id] || '').trim();
    switch (p.tipo) {
      case 'unica':
        return !!valor && otroOk;
      case 'unica_anidada':
        if (!valor?.opcion) return false;
        if (valor.opcion === p.subTrigger && !valor.sub) return false;
        return true;
      case 'abierta_numero':
        return (valor ?? '').toString().trim() !== '';
      case 'multiple':
        return Array.isArray(valor) && valor.length > 0 && otroOk;
      case 'ranking':
        return Array.isArray(valor) && valor.length === p.rankCount && otroOk;
      default:
        return false;
    }
  };

  const canAdvance = stepValid(pregunta);

  const setUnica = (opcion) => setAnswers((a) => ({ ...a, [currentId]: opcion }));
  const setAnidada = (opcion) => setAnswers((a) => ({ ...a, [currentId]: { opcion, sub: '' } }));
  const setSub = (sub) => setAnswers((a) => ({ ...a, [currentId]: { ...a[currentId], sub } }));
  const setAbierta = (val) => setAnswers((a) => ({ ...a, [currentId]: val }));
  const toggleMultiple = (opcion) => setAnswers((a) => {
    const cur = a[currentId] || [];
    return { ...a, [currentId]: cur.includes(opcion) ? cur.filter((o) => o !== opcion) : [...cur, opcion] };
  });
  const toggleRanking = (opcion) => setAnswers((a) => {
    const cur = a[currentId] || [];
    if (cur.includes(opcion)) return { ...a, [currentId]: cur.filter((o) => o !== opcion) };
    if (cur.length >= pregunta.rankCount) return a;
    return { ...a, [currentId]: [...cur, opcion] };
  });
  const setOtroTexto = (texto) => setOtros((o) => ({ ...o, [currentId]: texto }));

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLastStep) { handleSubmit(); return; }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const respuestas = {};
      PREGUNTAS.forEach((p) => {
        const valor = answers[p.id];
        respuestas[p.id] = otroDe(p) ? { valor, otro: (otros[p.id] || '').trim() } : valor;
      });
      await addDoc(collection(db, 'encuesta_entrada_resultados'), {
        agente_id: agente?.id || 'unknown',
        nombre: agente?.nombre || 'Invitado',
        respuestas,
        fecha: serverTimestamp(),
        proyecto: 'Blood 2026',
      });
      await marcarContestada(agente?.id, 'entrada');
      setDone(true);
    } catch (error) {
      console.error('Error al guardar encuesta de entrada:', error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const header = (
    <header className="agenda-header">
      <div className="agenda-header-text">
        <h1>Encuesta de entrada</h1>
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
          <p>Verificando tu encuesta...</p>
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
          <p>Ya registramos tu encuesta de entrada.</p>
        </div>
      </div>
    );
  }

  const renderOpciones = (opciones, seleccionado, onClick) => (
    <div className={`encuesta-options ${opciones.length <= 2 ? 'encuesta-options-row' : ''}`}>
      {opciones.map((op) => (
        <div
          key={op}
          className={`encuesta-option-pill ${opciones.length <= 2 ? 'encuesta-option-pill-yn' : ''} ${seleccionado === op ? 'selected' : ''}`}
          onClick={() => onClick(op)}
        >
          {op}
        </div>
      ))}
    </div>
  );

  const renderOtroTextarea = () => (
    <textarea
      className="encuesta-textarea encuesta-condicional"
      placeholder='En caso de contestar "Otro", por favor mencione cuál:'
      value={otros[currentId] || ''}
      onChange={(e) => setOtroTexto(e.target.value)}
    />
  );

  const renderStep = () => {
    const valor = answers[currentId];
    const mostrarOtro = incluyeOtro(pregunta, valor);

    if (pregunta.tipo === 'unica') {
      return (
        <div className="encuesta-poll-card" key={pregunta.id}>
          <h3 className="encuesta-question-text">{pregunta.texto}</h3>
          {pregunta.escala && <p className="encuesta-escala">{pregunta.escala}</p>}
          {renderOpciones(pregunta.opciones, valor, setUnica)}
          {mostrarOtro && renderOtroTextarea()}
        </div>
      );
    }

    if (pregunta.tipo === 'unica_anidada') {
      return (
        <div className="encuesta-poll-card" key={pregunta.id}>
          <h3 className="encuesta-question-text">{pregunta.texto}</h3>
          {renderOpciones(pregunta.opciones, valor?.opcion, setAnidada)}
          {valor?.opcion === pregunta.subTrigger && (
            <div className="encuesta-suboption">
              {renderOpciones(pregunta.subOpciones, valor?.sub, setSub)}
            </div>
          )}
        </div>
      );
    }

    if (pregunta.tipo === 'abierta_numero') {
      return (
        <div className="encuesta-poll-card" key={pregunta.id}>
          <h3 className="encuesta-question-text">{pregunta.texto}</h3>
          <input
            type="number"
            className="encuesta-input-numero"
            value={valor || ''}
            onChange={(e) => setAbierta(e.target.value)}
            placeholder="Escribe un número"
          />
        </div>
      );
    }

    if (pregunta.tipo === 'multiple') {
      const seleccion = valor || [];
      return (
        <div className="encuesta-poll-card" key={pregunta.id}>
          <h3 className="encuesta-question-text">{pregunta.texto}</h3>
          {pregunta.escala && <p className="encuesta-escala">{pregunta.escala}</p>}
          <div className="encuesta-options">
            {pregunta.opciones.map((op) => {
              const checked = seleccion.includes(op);
              return (
                <div
                  key={op}
                  className={`encuesta-option-pill encuesta-option-check ${checked ? 'selected' : ''}`}
                  onClick={() => toggleMultiple(op)}
                >
                  <span className="material-icons-round">{checked ? 'check_box' : 'check_box_outline_blank'}</span>
                  {op}
                </div>
              );
            })}
          </div>
          {mostrarOtro && renderOtroTextarea()}
        </div>
      );
    }

    if (pregunta.tipo === 'ranking') {
      const orden = valor || [];
      return (
        <div className="encuesta-poll-card" key={pregunta.id}>
          <h3 className="encuesta-question-text">{pregunta.texto}</h3>
          {pregunta.escala && <p className="encuesta-escala">{pregunta.escala}</p>}
          <div className="encuesta-options">
            {pregunta.opciones.map((op) => {
              const pos = orden.indexOf(op);
              return (
                <div
                  key={op}
                  className={`encuesta-option-pill encuesta-option-check ${pos >= 0 ? 'selected' : ''}`}
                  onClick={() => toggleRanking(op)}
                >
                  {pos >= 0 ? (
                    <span className="encuesta-rank-badge">{pos + 1}</span>
                  ) : (
                    <span className="material-icons-round">check_box_outline_blank</span>
                  )}
                  {op}
                </div>
              );
            })}
          </div>
          <p className="encuesta-escala">{orden.length}/{pregunta.rankCount}</p>
          {mostrarOtro && renderOtroTextarea()}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="encuestas-container animate-fade-in">
      {header}

      {step === 0 && (
        <p className="encuesta-intro">Antes de comenzar BLOOD 2026, ayúdanos respondiendo esta breve encuesta sobre tu práctica clínica en Mieloma Múltiple:</p>
      )}

      {pregunta.seccion && <p className="encuesta-seccion">{pregunta.seccion}</p>}
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

export default EncuestaEntrada;
