import { conferenciasData } from './conferenciasData';
import { useLiveDB, useLiveConfigs } from './pollService';
import './PanelDisplay.css';

function PanelDisplay() {
  const db = useLiveDB();
  const configs = useLiveConfigs();

  const activeConfId = Object.keys(db.activePolls).find(confId => db.activePolls[confId]);
  const activePreguntas = activeConfId ? (configs[activeConfId] || []) : [];
  const activePollId = activeConfId ? db.activePolls[activeConfId] : null;
  const activePoll = activePreguntas.find(p => p.id === activePollId);
  const isClosed = activePollId && db.pollsClosed[activePollId];
  const pollVotes = activePollId ? (db.votes[activePollId] || {}) : {};
  const totalVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);
  const maxVotes = Math.max(0, ...Object.values(pollVotes));
  const conf = activeConfId ? conferenciasData.find(c => c.id === Number(activeConfId)) : null;

  return (
    <div className="pd-container">
      <header className="pd-topbar">
        <span>BLOOD 2026</span>
        <span>{conf?.titulo || 'Panel en vivo'}</span>
      </header>

      <main className="pd-main">
        {!activePoll ? (
          <div className="pd-waiting">
            <span className="material-icons-round pd-waiting-icon">hourglass_top</span>
            <h2>Esperando la próxima pregunta</h2>
          </div>
        ) : (
          <div className="pd-question-section">
            <h1 className="pd-question">{activePoll.texto}</h1>
            <div className="pd-options-grid">
              {activePoll.opciones.map(opt => {
                const votes = pollVotes[opt.id] || 0;
                const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                const isWinner = isClosed && votes === maxVotes && votes > 0;
                return (
                  <div key={opt.id} className={`pd-option-row ${isWinner ? 'pd-option-winner' : ''}`}>
                    <div className="pd-bar-fill" style={{ width: `${pct}%` }} />
                    <span className="pd-option-text">{opt.texto}</span>
                    <span className="pd-option-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
            <p className="pd-footer">{isClosed ? 'Votación cerrada' : `${totalVotes} voto${totalVotes === 1 ? '' : 's'}`}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default PanelDisplay;
