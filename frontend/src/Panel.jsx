import { useState } from 'react';
import './Agenda.css';
import './Panel.css';
import { conferenciasData } from './conferenciasData';
import { useLiveDB, useLiveConfigs, castVote, setActivePoll, closePoll, resetPoll, finishPoll } from './pollService';

function Panel({ onBack, agente }) {
  const userId = agente?.id || 'USER_DEMO_123';
  const isDeveloper = agente?.tipo === 'Developer';
  const db = useLiveDB();
  const configs = useLiveConfigs();
  const pollsList = Object.keys(configs)
    .map(confId => ({ confId: Number(confId), preguntas: configs[confId] }))
    .filter(p => conferenciasData.some(c => c.id === p.confId));
  const [selectedConfId, setSelectedConfId] = useState(null);
  const [showStaff, setShowStaff] = useState(false);
  const [staffConfId, setStaffConfId] = useState(null);
  const [staffPollId, setStaffPollId] = useState(null);

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
