import React, { useState, useEffect } from 'react';
import './Agenda.css';
import './Constancia.css';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

function Constancia({ onBack, agente }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  const [checkingPrev, setCheckingPrev] = useState(true);

  const userName = agente?.nombre || 'Invitado';

  // Al cargar, verifica si el usuario ya contestó la encuesta
  useEffect(() => {
    const checkPreviousSubmission = async () => {
      if (!agente?.id) { setCheckingPrev(false); return; }
      try {
        const q = query(
          collection(db, 'encuestas_resultados'),
          where('agente_id', '==', agente.id)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setSurveyCompleted(true); // Ya contestó, ir directo al certificado
        }
      } catch (e) {
        console.warn('No se pudo verificar encuesta previa:', e.message);
      } finally {
        setCheckingPrev(false);
      }
    };
    checkPreviousSubmission();
  }, [agente?.id]);

  const surveyQuestions = [
    { id: 'q1', category: 'Contenido científico', text: '1. Relevancia y calidad del contenido científico presentado a lo largo del evento.' },
    { id: 'q2', category: 'Contenido científico', text: '2. Utilidad del contenido para su práctica clínica en Miocardiopatía Hipertrófica Obstructiva (MCHo).' },
    { id: 'q3', category: 'Contenido científico', text: '3. Equilibrio entre evidencia clínica, experiencia práctica y discusión de casos.' },
    { id: 'q4', category: 'Calidad de los speakers', text: '4. Dominio del tema y claridad en la exposición por parte de los ponentes.' },
    { id: 'q5', category: 'Calidad de los speakers', text: '5. Claridad en el entendimiento de las diferentes opciones de tratamiento disponibles para los pacientes con MCHo.' },
    { id: 'q6', category: 'Experiencia y herramientas digitales', text: '6. Valor educativo de la experiencia de Realidad Virtual (VR) para la comprensión del mecanismo de acción y casos clínicos.' },
    { id: 'q7', category: 'Experiencia y herramientas digitales', text: '7. Utilidad del soporte de Inteligencia Artificial (IA) como herramienta de apoyo educativo y su aplicabilidad en la práctica clínica.' },
    { id: 'q8', category: 'Dinámica y tiempos del evento', text: '8. Adecuación de la duración de las sesiones y respeto a los tiempos de la agenda.' },
    { id: 'q9', category: 'Aspectos logísticos', text: '9. Organización general del evento (registro, horarios, sedes, alimentos).' },
    { id: 'q10', category: 'Aspectos logísticos', text: '10. Calidad de la atención y comunicación por parte de la agencia logística previa al evento.' },
    { id: 'q11', category: 'Aspectos logísticos', text: '11. Atención y servicio brindado por la agencia organizadora durante el evento.' },
  ];

  const categories = [...new Set(surveyQuestions.map(q => q.category)), 'Comentarios finales'];

  const handleRatingChange = (qId, val) => {
    setRatings(prev => ({ ...prev, [qId]: val }));
  };

  const currentCategory = categories[currentStep];
  const currentQuestions = surveyQuestions.filter(q => q.category === currentCategory);

  const isStepValid = () => {
    if (currentStep === -1) return true;
    if (currentStep === categories.length - 1) return true;
    return currentQuestions.every(q => ratings[q.id]);
  };

  const handleNext = () => {
    if (currentStep === -1 || isStepValid()) {
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

  const progress = currentStep < 0 ? 0 : ((currentStep + 1) / categories.length) * 100;

  const header = (
    <header className="agenda-header">
      <div className="agenda-header-text">
        <h1>Constancia</h1>
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

  // Pantalla de carga mientras verifica
  if (checkingPrev) {
    return (
      <div className="constancia-container animate-fade-in">
        {header}
        <div className="checking-screen">
          <div className="checking-spinner"></div>
          <p>Verificando tu constancia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="constancia-container animate-fade-in">
      {header}

      {!surveyCompleted ? (
        <div className="survey-section stepper-mode">

          {currentStep === -1 ? (
            <div className="survey-intro-screen animate-fade-in">
              <div className="intro-icon-wrap">
                <span className="material-icons-round">edit_note</span>
              </div>
              <h3>¡Ya casi terminamos!</h3>
              <p>Antes de obtener tu certificado, ayúdanos con una breve encuesta de satisfacción.</p>

              <div className="instructions-box">
                <p><strong>Instrucciones:</strong> Por favor evalúe los aspectos del evento utilizando la escala del 1 al 5:</p>
                <ul className="scale-list">
                  <li><strong>1</strong> Muy deficiente</li>
                  <li><strong>2</strong> Deficiente</li>
                  <li><strong>3</strong> Aceptable</li>
                  <li><strong>4</strong> Bueno</li>
                  <li><strong>5</strong> Excelente</li>
                </ul>
              </div>

              <button className="btn-start-survey" onClick={handleNext}>
                Comenzar Encuesta
                <span className="material-icons-round">arrow_forward</span>
              </button>
            </div>
          ) : (
            <>
              <div className="survey-progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>

              <div className="survey-step-info">
                <span className="step-counter">Paso {currentStep + 1} de {categories.length}</span>
                <h3 className="step-category-name">{currentCategory}</h3>
              </div>
            </>
          )}

          <div className="survey-form-stepper">
            {currentStep !== -1 && (
              currentStep < categories.length - 1 ? (
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
              )
            )}

            {currentStep !== -1 && (
              <div className="stepper-actions">
                <button className="btn-stepper-back" onClick={handleBack}>
                  Anterior
                </button>

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
            )}
          </div>
        </div>
      ) : (
        <div className="survey-success-container">
          <div className="constancia-verified-badge animate-pop-in">
            <span className="material-icons-round">verified</span>
            <span>Constancia Oficial de Finalización</span>
          </div>

          <div className="cert-card animate-pop-in">
            {agente?.id && (
              <div className="cert-card-id">ID: {String(agente.id).slice(0, 8).toUpperCase()}</div>
            )}
            <p className="cert-label">Certificado de Asistencia</p>
            <h2 className="cert-name">{userName}</h2>
            <div className="cert-divider"></div>
            <p className="cert-description">
              Por su participación en Blood 2026, evento de actualización médica en hematología organizado por Bristol Myers Squibb.
            </p>
            <div className="cert-card-footer">
              <div className="cert-signature">
                <img src="/assets/icon_signature_squiggle.svg" alt="" className="cert-signature-mark" />
                <p className="cert-signature-name">Comité Organizador</p>
                <p className="cert-signature-role">Blood 2026</p>
              </div>
              <span className="material-icons-round cert-seal">workspace_premium</span>
            </div>
          </div>

          <h3 className="constancia-event-title">Blood 2026</h3>
          <p className="constancia-issue-date">Emitido el 28 de Agosto, 2026</p>

          <div className="constancia-actions animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              className="c-btn-download-pdf"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              <span className="material-icons-round">{isDownloading ? 'sync' : 'download'}</span>
              {isDownloading ? 'Generando PDF...' : 'Descargar PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Constancia;
