import React, { useState } from 'react';
import './Constancia.css';
import constanciaImg from './assets/constancia-base.png';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function Constancia({ onBack, agente }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const userName = agente?.nombre || 'Invitado';

  const surveyQuestions = [
    { id: 'q1', category: 'Contenido científico', text: 'Relevancia y calidad del contenido científico presentado.' },
    { id: 'q2', category: 'Contenido científico', text: 'Utilidad del contenido para su práctica clínica en MCHo.' },
    { id: 'q3', category: 'Contenido científico', text: 'Equilibrio entre evidencia clínica, experiencia práctica y discusión de casos.' },
    { id: 'q4', category: 'Calidad de los speakers', text: 'Dominio del tema y claridad en la exposición por parte de los ponentes.' },
    { id: 'q5', category: 'Calidad de los speakers', text: 'Claridad en el entendimiento de las diferentes opciones de tratamiento.' },
    { id: 'q6', category: 'Experiencia y herramientas digitales', text: 'Valor educativo de la experiencia de Realidad Virtual (VR).' },
    { id: 'q7', category: 'Experiencia y herramientas digitales', text: 'Utilidad de la IA como apoyo educativo y su aplicabilidad clínica.' },
    { id: 'q8', category: 'Dinámica y tiempos', text: 'Adecuación de la duración de las sesiones y respeto a los tiempos.' },
    { id: 'q9', category: 'Aspectos logísticos', text: 'Organización general del evento (registro, horarios, sedes, alimentos).' },
    { id: 'q10', category: 'Aspectos logísticos', text: 'Calidad de la comunicación por la agencia previa al evento.' },
    { id: 'q11', category: 'Aspectos logísticos', text: 'Atención y servicio de la agencia durante el evento.' },
  ];

  const categories = [...new Set(surveyQuestions.map(q => q.category)), 'Comentarios finales'];

  const handleRatingChange = (qId, val) => {
    setRatings(prev => ({ ...prev, [qId]: val }));
  };

  const currentCategory = categories[currentStep];
  const currentQuestions = surveyQuestions.filter(q => q.category === currentCategory);

  const isStepValid = () => {
    if (currentStep === categories.length - 1) return true; // Comentarios es opcional
    return currentQuestions.every(q => ratings[q.id]);
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Por favor responde todas las preguntas de esta sección.');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleDownloadPDF = async () => {
    if (!agente?.id) return;
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/constancia/${agente.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Constancia_Camzyos_${userName.replace(/\s+/g, '_')}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error('Error al descargar la constancia:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmitSurvey = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'encuestas_resultados'), {
        agente_id: agente?.id || 'unknown',
        nombre: userName,
        respuestas: ratings,
        comentarios: comments,
        fecha: serverTimestamp(),
        proyecto: 'Camzyos 2026'
      });
      setSurveyCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('DETALLE DEL ERROR FIRESTORE:', error);
      alert(`Error al guardar: ${error.message}. Verifica que las reglas de Firestore permitan escritura.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / categories.length) * 100;

  return (
    <div className="constancia-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Constancia</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>place</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
        </div>
      </header>

      {!surveyCompleted ? (
        <div className="survey-section stepper-mode">
          <div className="survey-progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="survey-step-info">
            <span className="step-counter">Paso {currentStep + 1} de {categories.length}</span>
            <h3 className="step-category-name">{currentCategory}</h3>
          </div>

          <div className="survey-form-stepper">
            {currentStep < categories.length - 1 ? (
              <div className="step-content animate-fade-in" key={currentStep}>
                {currentQuestions.map(q => (
                  <div key={q.id} className="survey-q-item">
                    <p className="survey-q-text">{q.text}</p>
                    <div className="rating-selector">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button 
                          key={v}
                          type="button"
                          className={`rating-btn ${ratings[q.id] === v ? 'active' : ''}`}
                          onClick={() => handleRatingChange(q.id, v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="step-content animate-fade-in">
                <p className="survey-q-text">Comentarios adicionales, sugerencias de mejora o aspectos relevantes:</p>
                <textarea 
                  placeholder="Escribe aquí tu opinión..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="survey-textarea"
                />
              </div>
            )}

            <div className="stepper-actions">
              {currentStep > 0 && (
                <button className="btn-stepper-back" onClick={handleBack}>
                  Anterior
                </button>
              )}
              
              {currentStep < categories.length - 1 ? (
                <button 
                  className="btn-stepper-next" 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Siguiente
                </button>
              ) : (
                <button 
                  className="btn-submit-survey-full" 
                  onClick={handleSubmitSurvey}
                  disabled={isSubmitting}
                >
                   {isSubmitting ? 'Guardando...' : 'Finalizar Encuesta'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="survey-success-container">
          <div className="constancia-badge-wrap animate-pop-in">
            <div className="constancia-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.47 4.54L17.9 4.1L18.75 7.45L22 8.7L21.15 12L22 15.3L18.75 16.55L17.9 19.9L14.47 19.46L12 22L9.53 19.46L6.1 19.9L5.25 16.55L2 15.3L2.85 12L2 8.7L5.25 7.45L6.1 4.1L9.53 4.54L12 2Z" fill="#ddbaf6" />
                <path d="M9 12L11 14L15 10" stroke="#4b2a8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Certificación Camzyos 2026</span>
            </div>
          </div>
          <div className="cert-preview-wrapper animate-pop-in">
            <div className="cert-preview-card">
              <img
                src={constanciaImg}
                alt="Constancia de Participación"
                className="cert-preview-img"
              />
              <div className="cert-preview-name-overlay">
                {userName}
              </div>
            </div>
            <div className="cert-full-screen-link">
              <span className="material-icons-round">workspace_premium</span>
              Emitida por Bristol Myers Squibb
            </div>
          </div>

          <div className="constancia-info animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2>¡Felicidades, {userName.split(' ')[0]}!</h2>
            <p>Tu constancia de participación está lista.</p>
          </div>

          <div className="constancia-actions animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <button
              className="c-btn-download-pdf"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              <span className="material-icons-round">{isDownloading ? 'sync' : 'file_download'}</span>
              {isDownloading ? 'Generando PDF...' : 'Descargar Constancia'}
            </button>
          </div>

          <p style={{ 
            textAlign: 'center', 
            fontSize: '11px', 
            color: '#555', 
            marginTop: '20px', 
            fontFamily: 'var(--font-inter)' 
          }}>
            Lanzamiento Camzyos México 2026
          </p>
        </div>
      )}
    </div>
  );
}

export default Constancia;
