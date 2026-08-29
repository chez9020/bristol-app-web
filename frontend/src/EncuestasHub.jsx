import './Agenda.css';
import './EncuestasHub.css';

function EncuestaRow({ numero, titulo, descripcion, hecha, bloqueada, textoBloqueo, onClick }) {
  const estado = hecha ? 'Completada' : bloqueada ? textoBloqueo : 'Pendiente';
  const clase = hecha ? 'ehub-row ehub-row-done' : bloqueada ? 'ehub-row ehub-row-locked' : 'ehub-row';

  return (
    <div
      className={clase}
      role="button"
      tabIndex={hecha || bloqueada ? -1 : 0}
      onClick={() => { if (!hecha && !bloqueada) onClick(); }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !hecha && !bloqueada) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="ehub-row-badge">
        {hecha
          ? <span className="material-icons-round">check</span>
          : bloqueada
            ? <span className="material-icons-round">lock</span>
            : numero}
      </div>
      <div className="ehub-row-text">
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
        <span className="ehub-row-estado">{estado}</span>
      </div>
      {!hecha && !bloqueada && (
        <span className="material-icons-round ehub-row-chevron">chevron_right</span>
      )}
    </div>
  );
}

function EncuestasHub({ onBack, onAbrirEntrada, onAbrirSalida, entradaHecha, salidaHecha, salidaActiva }) {
  const completadas = (entradaHecha ? 1 : 0) + (salidaHecha ? 1 : 0);
  const todas = completadas === 2;

  return (
    <div className="ehub-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Encuestas</h1>
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

      <div className="ehub-body">
        <div className="ehub-progreso">
          <p className="ehub-progreso-texto">
            {todas
              ? 'Listo, ya contestaste las dos encuestas.'
              : 'Completa las dos para descargar tu constancia'}
          </p>
          <div className="ehub-progreso-barra">
            <div className="ehub-progreso-fill" style={{ width: `${(completadas / 2) * 100}%` }} />
          </div>
          <span className="ehub-progreso-conteo">{completadas} de 2</span>
        </div>

        <EncuestaRow
          numero="1"
          titulo="Encuesta de entrada"
          descripcion="Tu experiencia previa al congreso"
          hecha={entradaHecha}
          onClick={onAbrirEntrada}
        />

        <EncuestaRow
          numero="2"
          titulo="Encuesta de salida"
          descripcion="Qué te pareció BLOOD 2026"
          hecha={salidaHecha}
          bloqueada={!salidaActiva}
          textoBloqueo="Disponible el 29 de agosto"
          onClick={onAbrirSalida}
        />
      </div>
    </div>
  );
}

export default EncuestasHub;
