import { useState } from 'react';
import './Agenda.css';
import { agendaData } from './agendaData';

function Agenda({ onBack }) {
  const [activeDay, setActiveDay] = useState('Jueves');

  const currentData = agendaData[activeDay];

  return (
    <div className="agenda-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Agenda</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>location_on</span>
            <span>Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="agenda-day-tabs">
        <div 
          className={`agenda-day-tab ${activeDay === 'Jueves' ? 'active' : ''}`}
          onClick={() => setActiveDay('Jueves')}
        >
          <span className="tab-day-name">Jueves</span>
          <span className="tab-day-date">16 Abril</span>
        </div>
        <div 
          className={`agenda-day-tab ${activeDay === 'Viernes' ? 'active' : ''}`}
          onClick={() => setActiveDay('Viernes')}
        >
          <span className="tab-day-name">Viernes</span>
          <span className="tab-day-date">17 Abril</span>
        </div>
      </div>

      <div className="current-day-banner">
        {currentData.title}
      </div>

      <div className="agenda-list-wrapper">
        {currentData.items.map((item, index) => (
          <div className="agenda-entry" key={index}>
            <span className="entry-time">{item.time}</span>
            <span className="entry-title">{item.title}</span>
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
