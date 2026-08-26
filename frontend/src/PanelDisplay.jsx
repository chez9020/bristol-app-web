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
  const pollAnswers = activePollId ? (db.answers[activePollId] || {}) : {};
  const respondentes = Object.keys(pollAnswers).length;
  const tipo = activePoll?.tipo || 'unica';
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

            {(tipo === 'unica' || tipo === 'multiple') && (() => {
              const base = tipo === 'unica' ? totalVotes : respondentes;
              return (
                <>
                  <div className="pd-options-grid">
                    {activePoll.opciones.map(opt => {
                      const votes = pollVotes[opt.id] || 0;
                      const pct = base > 0 ? Math.round((votes / base) * 100) : 0;
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
                  <p className="pd-footer">{isClosed ? 'Votación cerrada' : `${base} voto${base === 1 ? '' : 's'}`}</p>
                </>
              );
            })()}

            {tipo === 'ranking' && (
              <>
                <div className="pd-options-grid">
                  {activePoll.opciones
                    .slice()
                    .sort((a, b) => (pollVotes[b.id] || 0) - (pollVotes[a.id] || 0))
                    .map(opt => {
                      const score = pollVotes[opt.id] || 0;
                      const pct = maxVotes > 0 ? Math.round((score / maxVotes) * 100) : 0;
                      const isWinner = isClosed && score === maxVotes && score > 0;
                      return (
                        <div key={opt.id} className={`pd-option-row ${isWinner ? 'pd-option-winner' : ''}`}>
                          <div className="pd-bar-fill" style={{ width: `${pct}%` }} />
                          <span className="pd-option-text">{opt.texto}</span>
                        </div>
                      );
                    })}
                </div>
                <p className="pd-footer">{isClosed ? 'Votación cerrada' : `${respondentes} respuesta${respondentes === 1 ? '' : 's'}`}</p>
              </>
            )}

            {tipo === 'porcentaje' && (() => {
              const valores = Object.values(pollAnswers);
              const promedio = valores.length > 0 ? Math.round(valores.reduce((a, b) => a + Number(b), 0) / valores.length) : 0;
              return (
                <div className="pd-porcentaje-section">
                  <div className="pd-porcentaje-num">{promedio}%</div>
                  <p className="pd-footer">Promedio de {valores.length} respuesta{valores.length === 1 ? '' : 's'}</p>
                </div>
              );
            })()}

            {tipo === 'abierta' && (() => {
              const respuestas = Object.values(pollAnswers).slice(-10).reverse();
              return (
                <div className="pd-abierta-section">
                  {respuestas.length === 0 ? (
                    <p className="pd-footer">Aún no hay respuestas</p>
                  ) : (
                    <ul className="pd-abierta-list">
                      {respuestas.map((texto, i) => (
                        <li key={i} className="pd-abierta-item">{texto}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
}

export default PanelDisplay;
