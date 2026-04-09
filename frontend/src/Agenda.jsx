import { useState } from 'react';
import './Agenda.css';

function Agenda({ onBack }) {
  const [activeDay, setActiveDay] = useState('Jueves');

  const agendaData = {
    Jueves: {
      date: '16 Abril',
      title: 'Jueves 16 de Abril',
      items: [
        {
          time: '18:00 - 18:10',
          title: 'Bienvenida'
        },
        {
          time: '18:10 - 19:10',
          title: 'Retos Diagnosticos de MCHo:',
          description: 'Desde la clínica hasta la imagen',
          speakers: ['Dr. Enrique Berrios', 'Dra. Julieta Morales']
        },
        {
          time: '19:10 - 19:40',
          title: 'MCH Obstructiva:',
          description: 'Limitaciones del tratamiento convencional y retos en la práctica clínica',
          speakers: ['Dr. Adrián Fernández']
        },
        {
          time: '19:40 - 19:55',
          title: 'Break'
        },
        {
          time: '19:55 - 20:25', // Adjusted from Figma parallel time to be sequential
          title: 'MCH Obstructiva:',
          description: 'Evolución del tratamiento farmacológico hasta terapias dirigidas. “CENA”',
          speakers: ['Dr. Enrique Berrios']
        }
      ]
    },
    Viernes: {
      date: '17 Abril',
      title: 'Viernes 17 de Abril',
      items: [
        {
          time: '8:00 - 09:00',
          title: 'Desayuno'
        },
        {
          time: '9:00 - 10:00',
          title: 'La Inhibición de la miosina cardíaca:',
          description: 'Rompiendo paradigmas en el tratamiento de MCHo',
          speakers: ['Dr. Roberto Barriales']
        },
        {
          time: '10:00 - 10:45',
          title: 'De la evidencia clínica de largo plazo hacia datos del mundo real',
          speakers: ['Dr. Adrián Fernández']
        },
        {
          time: '10:45 - 11:15',
          title: 'Panel de discusión',
          speakers: ['Dr. Roberto Barriales', 'Dr. Adrián Fernández', 'Dr. Guillermo Antonio Llamas']
        },
        {
          time: '11:15 - 11:30',
          title: 'Break'
        }
      ]
    }
  };

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
