import React, { useState } from 'react';
import './Agenda.css';
import './Logistica.css';
import './Traslados.css';

// City code mapping for display
const cityCode = (ruta) => {
  const dest = ruta.split(' - ')[1];
  const codes = {
    'MEXICO': 'CDMX',
    'QUERETARO': 'QRO',
    'MONTERREY': 'MTY',
    'GUADALAJARA': 'GDL',
    'TOLUCA': 'TLC',
    'PUEBLA': 'PBC',
    'BUENOS AIRES': 'EZE',
  };
  return codes[dest] || dest.slice(0, 3);
};

// All 71 entries grouped by flight (ruta + sale time)
const allEntries = [
  // Grupo 1
  ...Array.from({ length: 20 }, (_, i) => ({ no: i + 1,  ruta: 'CANCUN - MEXICO',       sale: '17:35', pickup: '15:00' })),
  // Grupo 2
  { no: 21, ruta: 'CANCUN - QUERETARO',    sale: '18:06', pickup: '15:45' },
  ...Array.from({ length: 8 },  (_, i) => ({ no: i + 22, ruta: 'CANCUN - MONTERREY',    sale: '17:50', pickup: '15:45' })),
  { no: 30, ruta: 'CANCUN - QUERETARO',    sale: '18:06', pickup: '15:45' },
  ...Array.from({ length: 3 },  (_, i) => ({ no: i + 31, ruta: 'CANCUN - MONTERREY',    sale: '17:50', pickup: '15:45' })),
  // Grupo 3
  ...Array.from({ length: 22 }, (_, i) => ({ no: i + 34, ruta: 'CANCUN - MEXICO',       sale: '18:15', pickup: '16:00' })),
  // Grupo 4
  ...Array.from({ length: 4 },  (_, i) => ({ no: i + 56, ruta: 'CANCUN - GUADALAJARA',  sale: '19:14', pickup: '17:00' })),
  // Grupo 5
  ...Array.from({ length: 5 },  (_, i) => ({ no: i + 60, ruta: 'CANCUN - MEXICO',       sale: '19:36', pickup: '17:00' })),
  // Grupo 6
  ...Array.from({ length: 3 },  (_, i) => ({ no: i + 65, ruta: 'CANCUN - MEXICO',       sale: '20:35', pickup: '18:00' })),
  // Individuales
  { no: 68, ruta: 'CANCUN - MEXICO',       sale: '06:01', pickup: '03:00' },
  { no: 69, ruta: 'CANCUN - TOLUCA',       sale: '10:35', pickup: '08:00' },
  { no: 70, ruta: 'CANCUN - PUEBLA',       sale: '11:46', pickup: '09:15' },
  { no: 71, ruta: 'CANCUN - BUENOS AIRES', sale: '17:50', pickup: '14:30' },
];

// Group by ruta + sale to create one card per flight
const groupedFlights = allEntries.reduce((acc, entry) => {
  const key = `${entry.ruta}__${entry.sale}`;
  if (!acc[key]) {
    acc[key] = {
      ruta: entry.ruta,
      sale: entry.sale,
      pickup: entry.pickup,
      nos: [],
    };
  }
  acc[key].nos.push(entry.no);
  return acc;
}, {});

const flightGroups = Object.values(groupedFlights);

function FlightCard({ group }) {
  const destination = cityCode(group.ruta);
  const destFull = group.ruta.split(' - ')[1];
  const nosLabel = group.nos.length === 1
    ? `No. ${group.nos[0]}`
    : `Nos. ${group.nos[0]}–${group.nos[group.nos.length - 1]}`;

  return (
    <div className="flight-glass-card">
      <div className="traslado-badge-row">
        <span className="traslado-nos-badge">{nosLabel}</span>
        <span className="traslado-salida-tag">SALIDA • {group.sale}</span>
      </div>

      <div className="logi-route-info">
        <div className="logi-route-point">
          <span className="logi-route-time">{group.sale}</span>
          <span className="logi-route-city">CUN</span>
        </div>
        <div className="logi-flight-path">
          <div className="logi-path-line"></div>
          <img src="/assets/icon_flight_small.svg" alt="" className="logi-path-plane-icon" />
        </div>
        <div className="logi-route-point">
          <span className="logi-route-time">{destination}</span>
          <span className="logi-route-city">{destFull}</span>
        </div>
      </div>

      <div className="logi-transfer-inner-card">
        <img src="/assets/icon_transfer_bus.svg" alt="" className="logi-transfer-icon-box" />
        <div className="logi-transfer-text-block">
          <span className="logi-transfer-label-small">RECOGIDA EN HOTEL</span>
          <span className="logi-transfer-time-val">{group.pickup}</span>
        </div>
      </div>
    </div>
  );
}

function Traslados({ onBack }) {
  const [selectedDay, setSelectedDay] = useState('28');

  return (
    <div className="traslados-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Vuelos y Traslados</h1>
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

      <div className="traslados-day-tabs">
        <button
          className={`day-tab ${selectedDay === '28' ? 'active' : ''}`}
          onClick={() => setSelectedDay('28')}
        >
          28 Agosto
        </button>
        <button
          className={`day-tab ${selectedDay === '29' ? 'active' : ''}`}
          onClick={() => setSelectedDay('29')}
        >
          29 Agosto
        </button>
      </div>

      <div className="traslados-list-wrapper">
        {flightGroups.map((group, idx) => (
          <FlightCard key={idx} group={group} />
        ))}
      </div>
    </div>
  );
}

export default Traslados;
