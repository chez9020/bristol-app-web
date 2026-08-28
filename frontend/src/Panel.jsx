import { useState, useEffect } from 'react';
import './Agenda.css';
import './Panel.css';
import { conferenciasData } from './conferenciasData';
import { useLiveDB, useLiveConfigs, castVote, castVoteMultiple, castRespuesta, castRanking, RANKING_MAX, setActivePoll, closePoll, resetPoll, finishPoll } from './pollService';

function Panel({ onBack, agente }) {
  const userId = agente?.id || 'USER_DEMO_123';
  const isDeveloper = agente?.tipo === 'Developer';
  const db = useLiveDB();
  const configs = useLiveConfigs();
  const pollsList = Object.keys(configs)
    .map(confId => ({ confId: Number(confId), preguntas: configs[confId] }))
    .filter(p => conferenciasData.some(c => c.id === p.confId))
    .sort((a, b) => (a.confId === 30 ? -1 : b.confId === 30 ? 1 : 0)); // Q&A Día 2 (id 30) siempre primero
  const [selectedConfId, setSelectedConfId] = useState(null);
  const [showStaff, setShowStaff] = useState(false);
  const [staffConfId, setStaffConfId] = useState(null);
  const [staffPollId, setStaffPollId] = useState(null);
  const [porcentajeVal, setPorcentajeVal] = useState('');
  const [abiertaVal, setAbiertaVal] = useState('');
  const [rankingPicked, setRankingPicked] = useState([]);
  const [multiplePicked, setMultiplePicked] = useState([]);
  const [otroTextos, setOtroTextos] = useState({});
  const activePollIdForReset = selectedConfId ? db.activePolls[selectedConfId] : null;

  useEffect(() => {
    setPorcentajeVal('');
    setAbiertaVal('');
    setRankingPicked([]);
    setMultiplePicked([]);
    setOtroTextos({});
  }, [activePollIdForReset]);

  const header = (title) => (
    <header className="agenda-header">
      <div className="agenda-header-text">
        <h1>{title}</h1>
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

  if (showStaff && isDeveloper) {
    const effectiveStaffConfId = staffConfId ?? pollsList[0]?.confId ?? null;
    const staffConf = pollsList.find(p => p.confId === effectiveStaffConfId);
    const effectiveStaffPollId = staffPollId ?? staffConf?.preguntas[0]?.id ?? null;
    const staffPoll = staffConf?.preguntas.find(p => p.id === effectiveStaffPollId);
    const isPubliclyActive = staffPoll && db.activePolls[effectiveStaffConfId] === staffPoll.id;
    const isClosed = staffPoll && db.pollsClosed[staffPoll.id];

    return (
      <div className="pnl-container animate-fade-in">
        <header className="agenda-header">
          <div className="agenda-header-text">
            <h1>Modo staff</h1>
            <div className="agenda-subtitle">
              <span className="material-icons-round">event</span>
              <span>BLOOD 2026</span>
            </div>
          </div>
          <div className="back-btn-circle" onClick={() => setShowStaff(false)}>
            <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
          </div>
        </header>

        <div className="pnl-staff-body">
          {pollsList.length === 0 ? (
            <p className="pnl-staff-label">No hay preguntas configuradas. Crea preguntas en /panel-admin.</p>
          ) : (
            <>
              <label className="pnl-staff-label">Sesión</label>
              <select
                className="pnl-staff-select"
                value={effectiveStaffConfId ?? ''}
                onChange={(e) => {
                  const confId = Number(e.target.value);
                  setStaffConfId(confId);
                  setStaffPollId(pollsList.find(p => p.confId === confId)?.preguntas[0]?.id ?? null);
                }}
              >
                {pollsList.map(p => {
                  const conf = conferenciasData.find(c => c.id === p.confId);
                  return <option key={p.confId} value={p.confId}>{conf?.titulo || p.confId}</option>;
                })}
              </select>

              <label className="pnl-staff-label">Pregunta</label>
              <select
                className="pnl-staff-select"
                value={effectiveStaffPollId ?? ''}
                onChange={(e) => setStaffPollId(e.target.value)}
              >
                {staffConf?.preguntas.map(p => (
                  <option key={p.id} value={p.id}>{p.texto}</option>
                ))}
              </select>

              {staffPoll && (
                <>
                  <div className="pnl-staff-status">
                    Estado: {isPubliclyActive ? (isClosed ? 'Publicada (cerrada)' : 'Publicada (en vivo)') : 'No publicada'}
                  </div>
                  <div className="pnl-staff-actions">
                    <button className="pnl-staff-btn pnl-staff-btn-primary" onClick={() => setActivePoll(effectiveStaffConfId, staffPoll.id)}>
                      Publicar a asistentes
                    </button>
                    <button className="pnl-staff-btn" onClick={() => closePoll(staffPoll.id)}>
                      Cerrar votación
                    </button>
                    <button className="pnl-staff-btn" onClick={() => resetPoll(staffPoll.id)}>
                      Reiniciar votos
                    </button>
                    <button className="pnl-staff-btn pnl-staff-btn-danger" onClick={() => finishPoll(effectiveStaffConfId)}>
                      Terminar sesión
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (selectedConfId) {
    const pollConf = pollsList.find(p => p.confId === selectedConfId);
    const conf = conferenciasData.find(c => c.id === selectedConfId);
    const activePollId = db.activePolls[selectedConfId];
    const activePoll = pollConf?.preguntas.find(p => p.id === activePollId);
    const isClosed = activePollId && db.pollsClosed[activePollId];
    const pollVotes = activePollId ? (db.votes[activePollId] || {}) : {};
    const totalVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);
    const userSelectedOption = activePollId ? db.userVotes[userId]?.[activePollId] : null;

    return (
      <div className="pnl-container animate-fade-in">
        {header(conf?.titulo || 'Panel')}
        <div className="pnl-body">
          {!activePoll ? (
            <div className="pnl-waiting-card">
              <span className="material-icons-round pnl-waiting-icon">hourglass_top</span>
              <h3>Esperando pregunta</h3>
              <p>El staff aún no ha publicado una pregunta para esta sesión.</p>
            </div>
          ) : (
            <div className="pnl-poll-card">
              <h3 className="pnl-poll-question">{activePoll.texto}</h3>

              {(!activePoll.tipo || activePoll.tipo === 'unica') && (
                <div className="pnl-poll-options">
                  {activePoll.opciones.map(opt => {
                    const votes = pollVotes[opt.id] || 0;
                    const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                    const voted = !!userSelectedOption;
                    const isMine = userSelectedOption === opt.id;
                    return (
                      <div
                        key={opt.id}
                        className={`pnl-poll-option ${voted || isClosed ? 'pnl-poll-option-disabled' : ''} ${isMine ? 'pnl-poll-option-mine' : ''}`}
                        onClick={() => {
                          if (voted || isClosed) return;
                          castVote(userId, activePollId, opt.id);
                        }}
                      >
                        {(voted || isClosed) && (
                          <div className="pnl-poll-option-bar" style={{ width: `${pct}%` }} />
                        )}
                        <span className="pnl-poll-option-text">{opt.texto}</span>
                        {(voted || isClosed) && <span className="pnl-poll-option-pct">{pct}%</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {activePoll.tipo === 'multiple' && (() => {
                const voted = Array.isArray(userSelectedOption);
                const respondentes = Object.keys(db.answers[activePollId] || {}).length;
                const checked = multiplePicked;
                const setChecked = setMultiplePicked;
                return (
                  <div className="pnl-poll-options">
                    {activePoll.opciones.map(opt => {
                      const votes = pollVotes[opt.id] || 0;
                      const pct = respondentes > 0 ? Math.round((votes / respondentes) * 100) : 0;
                      const isMine = voted && userSelectedOption.includes(opt.id);
                      if (voted || isClosed) {
                        return (
                          <div key={opt.id} className={`pnl-poll-option pnl-poll-option-disabled ${isMine ? 'pnl-poll-option-mine' : ''}`}>
                            <div className="pnl-poll-option-bar" style={{ width: `${pct}%` }} />
                            <span className="pnl-poll-option-text">{opt.texto}</span>
                            <span className="pnl-poll-option-pct">{pct}%</span>
                          </div>
                        );
                      }
                      const isChecked = checked.includes(opt.id);
                      return (
                        <div key={opt.id}>
                          <label className="pnl-poll-checkbox-row">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => setChecked(isChecked ? checked.filter(id => id !== opt.id) : [...checked, opt.id])}
                            />
                            <span className="pnl-poll-option-text">{opt.texto}</span>
                          </label>
                          {opt.libre && isChecked && (
                            <input
                              type="text"
                              className="pnl-poll-num-input pnl-poll-otro-input"
                              placeholder="¿Cuál?"
                              value={otroTextos[opt.id] || ''}
                              onChange={(e) => setOtroTextos({ ...otroTextos, [opt.id]: e.target.value })}
                            />
                          )}
                        </div>
                      );
                    })}
                    {!voted && !isClosed && (
                      <button
                        className="pnl-poll-submit-btn"
                        disabled={checked.length === 0}
                        onClick={() => {
                          const libreOpt = activePoll.opciones.find(o => o.libre && checked.includes(o.id));
                          const otroTexto = libreOpt ? (otroTextos[libreOpt.id] || '').trim() : undefined;
                          castVoteMultiple(userId, activePollId, checked, otroTexto || undefined);
                        }}
                      >
                        Votar
                      </button>
                    )}
                  </div>
                );
              })()}

              {activePoll.tipo === 'porcentaje' && (() => {
                const voted = userSelectedOption !== undefined && userSelectedOption !== null;
                const respuestas = Object.values(db.answers[activePollId] || {});
                const promedio = respuestas.length > 0 ? Math.round(respuestas.reduce((a, b) => a + Number(b), 0) / respuestas.length) : 0;
                if (voted || isClosed) {
                  return (
                    <div className="pnl-poll-porcentaje-result">
                      <div className="pnl-poll-porcentaje-num">{promedio}%</div>
                      <p className="pnl-poll-porcentaje-sub">Promedio de {respuestas.length} respuestas{voted ? ` · tu respuesta: ${userSelectedOption}%` : ''}</p>
                    </div>
                  );
                }
                return (
                  <div className="pnl-poll-porcentaje-input">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="pnl-poll-num-input"
                      value={porcentajeVal}
                      onChange={(e) => setPorcentajeVal(e.target.value)}
                      placeholder="0-100"
                    />
                    <button
                      className="pnl-poll-submit-btn"
                      disabled={porcentajeVal === '' || Number(porcentajeVal) < 0 || Number(porcentajeVal) > 100}
                      onClick={() => castRespuesta(userId, activePollId, Number(porcentajeVal))}
                    >
                      Enviar
                    </button>
                  </div>
                );
              })()}

              {activePoll.tipo === 'abierta' && (() => {
                const voted = userSelectedOption !== undefined && userSelectedOption !== null;
                if (voted || isClosed) {
                  return <p className="pnl-poll-closed-note">{voted ? 'Respuesta enviada' : 'Votación cerrada'}</p>;
                }
                return (
                  <div className="pnl-poll-abierta-input">
                    <textarea
                      className="pnl-poll-textarea"
                      value={abiertaVal}
                      onChange={(e) => setAbiertaVal(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                    />
                    <button
                      className="pnl-poll-submit-btn"
                      disabled={!abiertaVal.trim()}
                      onClick={() => castRespuesta(userId, activePollId, abiertaVal.trim())}
                    >
                      Enviar
                    </button>
                  </div>
                );
              })()}

              {activePoll.tipo === 'ranking' && (() => {
                const voted = Array.isArray(userSelectedOption);
                const cap = Math.min(RANKING_MAX, activePoll.opciones.length);
                if (voted || isClosed) {
                  const maxScore = Math.max(1, ...Object.values(pollVotes));
                  return (
                    <div className="pnl-poll-options">
                      {activePoll.opciones
                        .slice()
                        .sort((a, b) => (pollVotes[b.id] || 0) - (pollVotes[a.id] || 0))
                        .map(opt => {
                          const score = pollVotes[opt.id] || 0;
                          const pct = Math.round((score / maxScore) * 100);
                          return (
                            <div key={opt.id} className="pnl-poll-option pnl-poll-option-disabled">
                              <div className="pnl-poll-option-bar" style={{ width: `${pct}%` }} />
                              <span className="pnl-poll-option-text">{opt.texto}</span>
                            </div>
                          );
                        })}
                    </div>
                  );
                }
                return (
                  <div className="pnl-poll-options">
                    <p className="pnl-poll-ranking-hint">Toca para ordenar tus {cap} favoritas (1 = más valiosa)</p>
                    {activePoll.opciones.map(opt => {
                      const pos = rankingPicked.indexOf(opt.id);
                      return (
                        <div
                          key={opt.id}
                          className={`pnl-poll-option pnl-poll-ranking-row ${pos >= 0 ? 'pnl-poll-option-mine' : ''}`}
                          onClick={() => {
                            if (pos >= 0) {
                              setRankingPicked(rankingPicked.filter(id => id !== opt.id));
                            } else if (rankingPicked.length < cap) {
                              setRankingPicked([...rankingPicked, opt.id]);
                            }
                          }}
                        >
                          {pos >= 0 && <span className="pnl-poll-ranking-badge">{pos + 1}</span>}
                          <span className="pnl-poll-option-text">{opt.texto}</span>
                        </div>
                      );
                    })}
                    <button
                      className="pnl-poll-submit-btn"
                      disabled={rankingPicked.length < cap}
                      onClick={() => castRanking(userId, activePollId, rankingPicked)}
                    >
                      Enviar
                    </button>
                  </div>
                );
              })()}

              {isClosed && <p className="pnl-poll-closed-note">Votación cerrada</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pnl-container animate-fade-in">
      {header('Panel')}
      <div className="pnl-body">
        {pollsList.length === 0 && (
          <div className="pnl-waiting-card">
            <span className="material-icons-round pnl-waiting-icon">hourglass_top</span>
            <h3>Sin encuestas activas</h3>
            <p>Aún no hay sesiones con preguntas configuradas.</p>
          </div>
        )}
        {pollsList.map(p => {
          const conf = conferenciasData.find(c => c.id === p.confId);
          if (!conf) return null;
          const isLive = !!db.activePolls[p.confId];
          return (
            <div key={p.confId} className="pnl-conf-item" onClick={() => setSelectedConfId(p.confId)}>
              <div className="pnl-conf-icon">
                <span className="material-icons-round">poll</span>
              </div>
              <div className="pnl-conf-info">
                <h4>{conf.titulo}</h4>
                <p>{conf.sala}</p>
              </div>
              {isLive && <span className="pnl-live-dot" />}
            </div>
          );
        })}
      </div>
      {isDeveloper && (
        <button className="pnl-staff-toggle" onClick={() => setShowStaff(true)}>Modo staff</button>
      )}
    </div>
  );
}

export default Panel;
