import React, { useState } from 'react';
import './Agenda.css';
import './Encuestas.css';

const QUESTIONS = [
  {
    id: 'experiencia_general',
    text: '1. ¿Cómo ha sido tu experiencia en Blood 2026?',
    options: ['Muy buena', 'Regular', 'Mala'],
  },
];

function Encuestas({ onBack, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (option) => {
    setAnswers(prev => ({ ...prev, [question.id]: option }));
  };

  const handleSiguiente = () => {
    if (!answers[question.id]) return;
    if (isLast) {
      onFinish?.(answers);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="encuestas-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Encuesta</h1>
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

      <div className="encuesta-progress-bar">
        <div className="encuesta-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="encuesta-poll-card">
        <h3 className="encuesta-question-text">{question.text}</h3>
        <div className="encuesta-options">
          {question.options.map(option => (
            <button
              key={option}
              type="button"
              className={`encuesta-option ${answers[question.id] === option ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        className="encuesta-btn-siguiente"
        onClick={handleSiguiente}
        disabled={!answers[question.id]}
      >
        Siguiente
      </button>
    </div>
  );
}

export default Encuestas;
