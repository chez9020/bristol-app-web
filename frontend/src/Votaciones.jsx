import React, { useState } from 'react';
import './Votaciones.css';
import { pollsData } from './pollsData';
import { useLiveDB, castVote } from './pollService';

function Votaciones({ onBack, agente }) {
  const db = useLiveDB();
  const [selectedConfId, setSelectedConfId] = useState(null);
  
  // Use real user ID if available
  const userId = agente?.id || 'USER_DEMO_123';

  // ─── STATE 1: List Configurations ───
  if (!selectedConfId) {
    return (
      <div className="votaciones-container animate-fade-in">
        <div className="perfil-header-area">
          <div className="perfil-header-text">
            <h1>Interacción en vivo</h1>
            <div className="perfil-header-subtitle">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="#008fb4" style={{flexShrink: 0}}>
                <path d="M160-120v-80h640v80H160Zm0-160v-80h280v80H160Zm0-160v-80h280v80H160Zm360 160L360-560l56-56 104 104 264-264 56 56-320 320Z"/>
              </svg>
              <span>Elige tu sala actual</span>
            </div>
          </div>
          <div className="back-button" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="v-section-container">
          <h2 className="v-list-title">Selecciona tu conferencia</h2>
          <p className="v-list-desc">Únete a la votación en vivo de la sesión a la que estás asistiendo en este momento.</p>
          
          <div className="v-conf-list">
            {pollsData.map(conf => {
              // Check if this conference currently has an active poll globally
              const hasActivePoll = !!db.activePolls[conf.id];
              
              return (
                <div key={conf.id} className="v-conf-item" onClick={() => setSelectedConfId(conf.id)}>
                  <div className="v-conf-icon">
                    <span className="material-icons-round">campaign</span>
                  </div>
                  <div className="v-conf-info">
                    <h3>{conf.title}</h3>
                    <span>{conf.speaker} • {conf.location}</span>
                  </div>
                  {hasActivePoll ? (
                    <div className="v-live-dot" style={{ margin: '0 10px' }}></div>
                  ) : null}
                  <span className="material-icons-round" style={{ color: 'rgba(255,255,255,0.3)' }}>chevron_right</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── STATE 2: Active or Waiting Poll Info ───
  const conf = pollsData.find(c => c.id === selectedConfId);
  const activePollId = db.activePolls[selectedConfId];
  const activePoll = conf.preguntas.find(p => p.id === activePollId);
  const isClosed = activePollId && db.pollsClosed[activePollId];
  
  // Calculate specific vote stats
  const pollVotes = activePollId ? (db.votes[activePollId] || {}) : {};
  const totalVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);
  
  // Guard check if user already voted
  const userSelectedOption = activePollId ? (db.userVotes[userId]?.[activePollId]) : null;

  return (
    <div className="votaciones-container animate-fade-in">
      <div className="perfil-header-area">
        <div className="perfil-header-text">
           <h1>Votación en Sala</h1>
           <div className="perfil-header-subtitle">
             <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="#008fb4" style={{flexShrink: 0}}>
               <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-560q0-109-69.5-184.5T480-820q-101 0-170.5 75.5T240-560q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-560q0-150 96.5-245T480-900q127 0 223.5 95T800-560q0 112-79.5 229.5T480-80Zm0-480Z"/>
             </svg>
             <span>{conf.location}</span>
           </div>
        </div>
        <div className="back-button" onClick={() => setSelectedConfId(null)}>
           <span className="material-icons-round" style={{color: 'white'}}>arrow_back</span>
        </div>
      </div>

      <div className="v-section-container">
        {/* Session Card Info */}
        <div className="v-session-card">
          <div className="v-session-top">
            <span className="v-session-label">SESIÓN ACTUAL</span>
            <div 
              className="v-live-badge" 
              style={{ 
                backgroundColor: activePoll ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.2)', 
                borderColor: activePoll ? 'rgba(239, 68, 68, 0.3)' : 'rgba(148, 163, 184, 0.3)', 
                color: activePoll ? '#f87171' : '#cbd5e1' 
              }}>
              {activePoll && <div className="v-live-dot"></div>}
              <span>{activePoll ? 'EN VIVO' : 'EN ESPERA'}</span>
            </div>
          </div>
          
          <h2 className="v-session-title">{conf.title}</h2>
          <div className="v-session-location">
            <span className="material-icons-round">person</span>
            <span>{conf.speaker}</span>
          </div>
        </div>

        {/* Dynamic Poll Visuals */}
        {!activePoll ? (
          <div className="v-waiting-card">
             <span className="material-icons-round spin-slow">hourglass_empty</span>
             <h3>Esperando la dinámica...</h3>
             <p>El presentador aún no ha activado ninguna encuesta para esta sesión. Cuando lo haga, aparecerá aquí automáticamente.</p>
          </div>
        ) : (
          <div className="v-poll-card">
            <div className="v-poll-header">
              <span className="v-poll-label">PREGUNTA EN CURSO</span>
              <h3 className="v-poll-question">{activePoll.texto}</h3>
              <span className="v-poll-total">Votos totales registrados: {totalVotes.toLocaleString()}</span>
            </div>

            <div className="v-poll-options">
              {activePoll.opciones.map((opt) => {
                const votes = pollVotes[opt.id] || 0;
                const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                const isSelected = userSelectedOption === opt.id;
                const disabled = !!userSelectedOption || isClosed;

                return (
                  <div 
                    key={opt.id} 
                    className={`v-poll-option ${(isSelected || (isClosed && userSelectedOption === opt.id)) ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={() => {
                      if (!disabled) castVote(userId, activePollId, opt.id);
                    }}
                  >
                    {/* Background fill ONLY shows after user votes or poll is closed */}
                    {(userSelectedOption || isClosed) && (
                      <div className="v-poll-progress" style={{ width: `${percent}%` }}></div>
                    )}

                    <div className="v-poll-option-content">
                      <div className="v-radio">
                        <div className="v-radio-inner"></div>
                      </div>
                      <span className="v-poll-text">{opt.texto}</span>
                    </div>

                    {/* Stats numeric text ONLY shows after action */}
                    {(userSelectedOption || isClosed) && (
                      <span className="v-poll-percent">{percent}%</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="v-poll-footer">
              <span className="material-icons-round">{isClosed ? 'lock' : 'lock_clock'}</span>
              <span>{isClosed ? 'LA VOTACIÓN SE HA CERRADO' : 'LA VOTACIÓN ESTÁ ABIERTA EN ESTE MOMENTO'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Votaciones;
