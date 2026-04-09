import React, { useState } from 'react';
import './Traslados.css';

const trasladosData = {
  '16 Abril': [
    { 
      flight: 'AM 825', 
      duration: 'DIRECTO • 2H 11M', 
      from: { time: '08:59', city: 'MID' }, 
      to: { time: '11:10', city: 'CDMX' }, 
      pickup: '07:00 AM' 
    },
    { 
      flight: 'AM 831', 
      duration: 'DIRECTO • 2H 15M', 
      from: { time: '13:55', city: 'MID' }, 
      to: { time: '16:10', city: 'CDMX' }, 
      pickup: '12:00 PM' 
    }
  ],
  '17 Abril': [
    { 
      flight: 'AM 825', 
      duration: 'DIRECTO • 2H 11M', 
      from: { time: '08:59', city: 'MID' }, 
      to: { time: '11:10', city: 'CDMX' }, 
      pickup: '07:00 AM' 
    },
    { 
      flight: 'AM 831', 
      duration: 'DIRECTO • 2H 15M', 
      from: { time: '13:55', city: 'MID' }, 
      to: { time: '16:10', city: 'CDMX' }, 
      pickup: '12:00 PM' 
    },
    { 
      flight: 'AM 831', 
      duration: 'DIRECTO • 2H 15M', 
      from: { time: '13:55', city: 'MID' }, 
      to: { time: '16:10', city: 'CDMX' }, 
      pickup: '12:00 PM',
      isBlue: true // Small color variation for the 3rd one as in Figma metadata
    }
  ],
};

function Traslados({ onBack }) {
  const [activeDate, setActiveDate] = useState('16 Abril');
  const flights = trasladosData[activeDate] || [];

  return (
    <div className="traslados-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Vuelos y Traslados</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>place</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="traslados-tabs-container">
        <button 
          className={`traslados-tab-btn ${activeDate === '16 Abril' ? 'active' : ''}`}
          onClick={() => setActiveDate('16 Abril')}
        >
          16 Abril
        </button>
        <button 
          className={`traslados-tab-btn ${activeDate === '17 Abril' ? 'active' : ''}`}
          onClick={() => setActiveDate('17 Abril')}
        >
          17 Abril
        </button>
      </div>

      <div className="traslados-list-wrapper">
        {flights.map((f, idx) => (
          <div className="flight-card-enhanced" key={idx}>
            <div className="flight-badge-row">
              <span className="flight-number-tag">{f.flight}</span>
              <span className="flight-duration-tag">{f.duration}</span>
            </div>

            <div className="flight-route-info">
              <div className="route-point">
                <span className="route-time">{f.from.time}</span>
                <span className="route-city">{f.from.city}</span>
              </div>
              <div className="flight-path">
                <div className="path-line"></div>
                <span className="material-icons-round path-plane-icon">flight</span>
              </div>
              <div className="route-point">
                <span className="route-time">{f.to.time}</span>
                <span className="route-city">{f.to.city}</span>
              </div>
            </div>

            <div className="transfer-inner-card" style={{ marginBottom: 0 }}>
              <div className="transfer-icon-box" style={{ background: f.isBlue ? '#008fb4' : '#8347ad' }}>
                <span className="material-icons-round" style={{color: 'white'}}>directions_bus</span>
              </div>
              <div className="transfer-text-block">
                <span className="transfer-label-small" style={{ color: f.isBlue ? '#008fb4' : 'rgba(255, 255, 255, 0.7)' }}>RECOGIDA EN HOTEL</span>
                <span className="transfer-time-val">{f.pickup}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Traslados;
