import { useState } from 'react';
import './Agenda.css';
import { agendaData } from './agendaData';

function Agenda({ onBack }) {
  const [activeDay, setActiveDay] = useState('Viernes');

  const currentData = agendaData[activeDay];

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
            <span className="entry-time">{item.time}</span>
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
