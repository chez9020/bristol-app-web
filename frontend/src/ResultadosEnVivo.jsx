import React, { useState } from 'react';
import './ResultadosEnVivo.css';
import { pollsData } from './pollsData';
import { useLiveDB, setActivePoll, closePoll, generateRandomVotes, resetPoll, finishPoll } from './pollService';

function ResultadosEnVivo() {
  const db = useLiveDB();
  const [showAdmin, setShowAdmin] = useState(true);
  
  // Admin Local State
  const [adminConfId, setAdminConfId] = useState(pollsData[0].id);
  const selectedConf = pollsData.find(c => c.id === adminConfId);
  const [adminPollId, setAdminPollId] = useState(selectedConf.preguntas[0].id);

  // Presenter View Driven by Admin Selection
  const presenterPollData = selectedConf.preguntas.find(p => p.id === adminPollId);
  const isPubliclyActive = db.activePolls[adminConfId] === adminPollId;
  const isClosed = db.pollsClosed[adminPollId];

  const pollVotes = db.votes[adminPollId] || {};
  const totalVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);

  const calculateOptions = () => {
    return presenterPollData.opciones.map(opt => {
      const votes = pollVotes[opt.id] || 0;
      const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      return { ...opt, votes, percent };
    });
  };

  const optionsWithStats = calculateOptions();
  // Only calculate winner if poll is closed AND there are votes
  const maxPercent = (isClosed && totalVotes > 0) ? Math.max(...optionsWithStats.map(o => o.percent)) : -1;

  const handleConfChange = (e) => {
    const newConfId = e.target.value;
    setAdminConfId(newConfId);
    const newConf = pollsData.find(c => c.id === newConfId);
    setAdminPollId(newConf.preguntas[0].id);
  };

  const handleClosePollAndAutoNext = () => {
    closePoll(adminPollId);

    const questions = selectedConf.preguntas;
    const currentIndex = questions.findIndex(p => p.id === adminPollId);
    
    // If there is a next question, auto-transition after showing winner for a few seconds
    if (currentIndex >= 0 && currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      
      // En 5 segundos (para que la audiencia alcance a celebrar al ganador con el Glow Neón)
      // la pantalla saltará solita a la siguiente pregunta y la publicará automáticamente.
      setTimeout(() => {
        setAdminPollId(nextQuestion.id);
        setActivePoll(adminConfId, nextQuestion.id);
      }, 4000);
    } else {
      // Si ya era la última pregunta, a los 2 segundos la desconectamos para enviar
      // la pantalla a "Gracias por Participar"
      setTimeout(() => {
        finishPoll(adminConfId);
      }, 2000);
    }
  };

  return (
    <div className="resultados-fullscreen">
      
      {/* ─── ADMIN PANEL (Visible only to presenter) ─── */}
      {showAdmin && (
        <div className="r-admin-panel">
          <div className="r-admin-header">
            <h3 className="r-admin-title">Panel de Control (Admin)</h3>
            <span 
              className="material-icons-round" 
              style={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '18px' }}
              onClick={() => setShowAdmin(false)}
            >
              close
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase' }}>Sesión:</label>
            <select className="r-admin-select" value={adminConfId} onChange={handleConfChange}>
              {pollsData.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase' }}>Pregunta:</label>
            <select className="r-admin-select" value={adminPollId} onChange={(e) => setAdminPollId(e.target.value)}>
              {selectedConf.preguntas.map(p => <option key={p.id} value={p.id}>{p.texto}</option>)}
            </select>
          </div>

          <div className="r-admin-actions">
            {!isPubliclyActive ? (
              <button className="r-btn-primary" onClick={() => setActivePoll(adminConfId, adminPollId)}>
                1. Publicar a Asistentes
              </button>
            ) : (
              <button className="r-btn-secondary" disabled>
                ✓ Publicada y Activa
              </button>
            )}

            <button className="r-btn-secondary" onClick={() => generateRandomVotes(adminPollId, presenterPollData.opciones)}>
              + Simular 50 Votos
            </button>
            <button className="r-btn-secondary" onClick={() => resetPoll(adminPollId)}>
              ↻ Reiniciar Votos
            </button>

            {/* Se movió el botón Ver Ganador a la visibilidad principal */}
          </div>
        </div>
      )}

      {!showAdmin && (
        <div 
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 100, cursor: 'pointer', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '50%' }}
          onClick={() => setShowAdmin(true)}
        >
          <span className="material-icons-round" style={{ color: 'rgba(255,255,255,0.3)', verticalAlign: 'middle' }}>settings</span>
        </div>
      )}

      {/* ─── BIG PROJECTOR SCREEN ─── */}
      <div className="r-topbar">
        <div className="r-topbar-left">
          <div className="r-topbar-event">
            <h2>IO SUMMIT 2026</h2>
            <span>{selectedConf.location} • {selectedConf.title}</span>
          </div>
        </div>
        <div className="r-topbar-right" style={{ marginRight: '40px' }}>
          {isPubliclyActive && !isClosed ? (
            <div className="r-live-indicator">
              <div className="r-live-dot"></div>
              <span className="r-live-text">En Vivo</span>
            </div>
          ) : isClosed ? (
             <div className="r-live-indicator" style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.2)' }}>
               <span className="material-icons-round" style={{ fontSize: '14px', color: '#cbd5e1' }}>lock</span>
               <span className="r-live-text" style={{ color: '#cbd5e1' }}>Cerrada</span>
             </div>
          ) : null}
          <div className="r-voter-count">
            <strong>{totalVotes.toLocaleString()}</strong> votos
          </div>
        </div>
      </div>

      <div className="r-main">
        {isPubliclyActive ? (
          <>
            <div className="r-question-section">
              <span className="r-question-label">
                {isClosed ? 'RESULTADOS FINALES' : 'VOTACIÓN RÁPIDA'}
              </span>
              <h1 className="r-question-text">{presenterPollData.texto}</h1>
              <p className="r-total-votes">
                Responde desde tu dispositivo móvil
              </p>
            </div>

            <div className="r-options-grid">
          {optionsWithStats.map((opt) => {
            const isWinner = isClosed && opt.percent === maxPercent && maxPercent > 0;
            return (
              <div className="r-option-row" key={opt.id}>
                <span className="r-option-label" style={{ color: isWinner ? '#00d4ff' : 'rgba(255, 255, 255, 0.9)' }}>
                  {opt.texto}
                </span>
                <div className="r-bar-container">
                  <div 
                    className={`r-bar-fill ${isWinner ? 'winner' : 'normal'}`}
                    style={{ width: `${opt.percent || 1}%` }} // Ensure at least 1% so the bar is visible minimally
                  >
                    <span className="r-bar-percent" style={{ opacity: totalVotes > 0 ? 1 : 0 }}>{opt.percent}%</span>
                  </div>
                </div>
                <span className="r-option-votes-count">{opt.votes.toLocaleString()} votos</span>
              </div>
            );
          })}
          </div>
        </>) : (
          <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="material-icons-round spin-slow" style={{ fontSize: '48px', color: '#008fb4', marginBottom: '20px' }}>hourglass_empty</span>
            <h1 className="r-question-text" style={{ fontSize: '42px', color: 'white', letterSpacing: '-1px' }}>¡Gracias por Participar!</h1>
            <p className="r-total-votes" style={{ fontSize: '20px', marginTop: '10px' }}>
              Esperando a que el presentador inicie la siguiente dinámica...
            </p>
          </div>
        )}
      </div>

      {/* Botón dinámico colocado debajo de la sección "r-main" */}
      {isPubliclyActive && !isClosed && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', zIndex: 10 }}>
          <button 
            className="r-btn-danger" 
            onClick={handleClosePollAndAutoNext}
            style={{
              padding: '16px 40px', 
              fontSize: '16px', 
              borderRadius: '100px', 
              border: '2px solid rgba(239, 68, 68, 0.4)',
              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            cerrar votación
          </button>
        </div>
      )}

      <div className="r-footer">
        <span className="material-icons-round">
          {!isPubliclyActive ? 'visibility_off' : isClosed ? 'lock' : 'rss_feed'}
        </span>
        <span className="r-footer-text">
          {!isPubliclyActive 
            ? 'La encuesta aún no es visible para los asistentes'
            : isClosed 
              ? 'Votación finalizada. Ya no se aceptan nuevas respuestas' 
              : 'La votación está abierta • Los resultados se actualizan en tiempo real'}
        </span>
      </div>
    </div>
  );
}

export default ResultadosEnVivo;
