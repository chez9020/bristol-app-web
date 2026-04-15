import React from 'react';
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
  const origin = 'CUN';
  const destination = cityCode(group.ruta);
  const destFull = group.ruta.split(' - ')[1];
  const nosLabel = group.nos.length === 1
    ? `No. ${group.nos[0]}`
    : `Nos. ${group.nos[0]}–${group.nos[group.nos.length - 1]}`;

  return (
    <div className="flight-card-enhanced">
      <div className="flight-badge-row">
        <span className="flight-number-tag">{nosLabel}</span>
        <span className="flight-duration-tag">SALIDA • {group.sale}</span>
      </div>

      <div className="flight-route-info">
        <div className="route-point">
          <span className="route-time">{group.sale}</span>
          <span className="route-city">CUN</span>
        </div>
        <div className="flight-path">
          <div className="path-line"></div>
          <span className="material-icons-round path-plane-icon">flight</span>
        </div>
        <div className="route-point route-point-right">
          <span className="route-time">{destination}</span>
          <span className="route-city">{destFull}</span>
        </div>
      </div>

      <div className="transfer-inner-card">
        <div className="transfer-icon-box">
          <span className="material-icons-round" style={{ color: 'white' }}>directions_bus</span>
        </div>
        <div className="transfer-text-block">
          <span className="transfer-label-small">RECOGIDA EN HOTEL</span>
          <span className="transfer-time-val">{group.pickup}</span>
        </div>
      </div>
    </div>
  );
}

function Traslados({ onBack }) {
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
          <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
        </div>
      </header>

      <div className="traslados-list-wrapper">
        {flightGroups.map((group, idx) => (
          <FlightCard key={idx} group={group} />
        ))}
      </div>
    </div>
  );
}

export default Traslados;
