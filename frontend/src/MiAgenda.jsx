import { useState } from 'react';
import './Agenda.css';
import { agendaData } from './agendaData';
import { getFavoritos, toggleFavorito } from './favoritos';

function MiAgenda({ onBack, agente }) {
  const [favoritos, setFavoritos] = useState(() => getFavoritos(agente?.id));

  const handleToggleFavorito = (itemId) => {
    setFavoritos(toggleFavorito(agente?.id, itemId));
  };

  const dayGroups = Object.entries(agendaData)
    .map(([key, day]) => ({
      key,
      title: day.title,
      items: day.items.filter((item) => favoritos.includes(item.id)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="agenda-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Mi agenda</h1>
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

      {dayGroups.length === 0 ? (
        <p className="miagenda-empty">
          Aún no has guardado conferencias. Toca el corazón en Agenda para agregarlas aquí.
        </p>
      ) : (
        dayGroups.map((group) => (
          <div key={group.key}>
            <span className="miagenda-day-pill">{group.title}</span>
            {group.items.map((item) => (
              <div className="miagenda-card" key={item.id}>
                <div className="miagenda-card-top">
                  <span className="miagenda-time">
                    <span className="material-icons-round">schedule</span>
                    {item.time}
                  </span>
                  <button
                    className="miagenda-heart-badge"
                    onClick={() => handleToggleFavorito(item.id)}
                    aria-label="Quitar de Mi agenda"
                  >
                    <span className="material-icons-round">favorite</span>
                  </button>
                </div>
                <p className="miagenda-title">
                  {item.title ? `${item.title} ${item.description || ''}` : item.description}
                </p>
                {item.speakers && item.speakers.map((s, si) => (
                  <span className="miagenda-speaker" key={si}>
                    <span className="material-icons-round">person</span>
                    {s}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default MiAgenda;
