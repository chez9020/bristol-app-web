import { useState } from 'react';
import './Agenda.css';
import { agendaData } from './agendaData';
import { getFavoritos, toggleFavorito } from './favoritos';

function Agenda({ onBack, agente }) {
  const [activeDay, setActiveDay] = useState('Viernes');
  const [favoritos, setFavoritos] = useState(() => getFavoritos(agente?.id));
  const currentData = agendaData[activeDay];

  const handleToggleFavorito = (itemId) => {
    setFavoritos(toggleFavorito(agente?.id, itemId));
  };

  return (
    <div className="agenda-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Agenda</h1>
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

      <div className="agenda-day-tabs">
        <div
          className={`agenda-day-tab ${activeDay === 'Viernes' ? 'active' : ''}`}
          onClick={() => setActiveDay('Viernes')}
        >
          <span className="tab-day-name">Viernes</span>
          <span className="tab-day-date">28 de Agosto</span>
        </div>
        <div
          className={`agenda-day-tab ${activeDay === 'Sabado' ? 'active' : ''}`}
          onClick={() => setActiveDay('Sabado')}
        >
          <span className="tab-day-name">Sábado</span>
          <span className="tab-day-date">29 de Agosto</span>
        </div>
      </div>

      <div className="current-day-banner">
        {currentData.title}
      </div>

      <div className="agenda-list-wrapper">
        {currentData.items.length === 0 && (
          <div className="agenda-entry">
            <span className="entry-description">Próximamente disponible</span>
          </div>
        )}
        {currentData.items.map((item, index) => (
          <div className="agenda-entry" key={index}>
            <div className="entry-top-row">
              <span className="entry-time">{item.time}</span>
              <button
                className={`entry-heart-btn ${favoritos.includes(item.id) ? 'active' : ''}`}
                onClick={() => handleToggleFavorito(item.id)}
                aria-label="Agregar a Mi agenda"
              >
                <span className="material-icons-round">
                  {favoritos.includes(item.id) ? 'favorite' : 'favorite_border'}
                </span>
              </button>
            </div>
            {item.title && <span className="entry-title">{item.title}</span>}
            {item.description && <span className="entry-description">{item.description}</span>}
            {item.speakers && (
              <div className="entry-speakers">
                {item.speakers.map((s, si) => (
                  <span className="speaker-line" key={si}>{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Agenda;
