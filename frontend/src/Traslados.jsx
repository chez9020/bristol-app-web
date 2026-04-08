import React, { useState } from 'react';
import './Traslados.css';

const trasladosData = {
  'Sáb 7 Marzo': [
    { flight: 'AM 521',  hora: '11:18', pickup: '8:00',  ruta: 'CANCÚN → MÉXICO' },
    { flight: 'AM 555',  hora: '19:42', pickup: '16:10', ruta: 'CANCÚN → MÉXICO' },
    { flight: 'AM 561',  hora: '20:55', pickup: '17:30', ruta: 'CANCÚN → MÉXICO' },
  ],
  'Dom 8 Marzo': [
    { flight: 'VB 2102', hora: '6:00',  pickup: '3:00',  ruta: 'CANCÚN → VERACRUZ' },
    { flight: 'AM 501',  hora: '6:01',  pickup: '3:00',  ruta: 'CANCÚN → MÉXICO' },
    { flight: 'AM 505',  hora: '7:06',  pickup: '4:00',  ruta: 'CANCÚN → MÉXICO' },
    { flight: 'AR 1371', hora: '8:50',  pickup: '4:50',  ruta: 'CANCÚN → BUENOS AIRES' },
    { flight: 'VB 2152', hora: '8:00',  pickup: '5:00',  ruta: 'CANCÚN → TAMPICO' },
    { flight: 'AM 513',  hora: '8:40',  pickup: '5:30',  ruta: 'CANCÚN → MÉXICO' },
    { flight: 'VB 7416', hora: '10:25', pickup: '7:00',  ruta: 'CANCÚN → AIFA' },
    { flight: 'VB 2164', hora: '10:25', pickup: '7:00',  ruta: 'CANCÚN → MONTERREY' },
    { flight: 'VB 7032', hora: '10:30', pickup: '7:00',  ruta: 'CANCÚN → TOLUCA' },
    { flight: 'Y4 1049', hora: '10:39', pickup: '7:00',  ruta: 'CANCÚN → GUADALAJARA' },
    { flight: 'YA 101',  hora: '10:43', pickup: '7:00',  ruta: 'CANCÚN → MÉXICO' },
    { flight: 'VB 8005', hora: '11:00', pickup: '7:30',  ruta: 'CANCÚN → CIUDAD JUÁREZ' },
    { flight: 'VB 7412', hora: '11:05', pickup: '7:30',  ruta: 'CANCÚN → GUADALAJARA' },
    { flight: 'AM 521',  hora: '11:22', pickup: '7:50',  ruta: 'CANCÚN → MÉXICO' },
    { flight: 'CM 317',  hora: '11:45', pickup: '7:45',  ruta: 'CANCÚN → PANAMÁ' },
    { flight: 'Y4 3500', hora: '11:12', pickup: '7:50',  ruta: 'CANCÚN → LEÓN' },
    { flight: 'Y4 3552', hora: '12:06', pickup: '8:40',  ruta: 'CANCÚN → PUEBLA' },
    { flight: 'AM 527',  hora: '12:35', pickup: '9:10',  ruta: 'CANCÚN → MÉXICO' },
    { flight: 'VB 2026', hora: '12:45', pickup: '9:10',  ruta: 'CANCÚN → PUEBLA' },
    { flight: 'VB 2168', hora: '12:50', pickup: '9:10',  ruta: 'CANCÚN → MONTERREY' },
    { flight: 'VB 2184', hora: '13:25', pickup: '9:50',  ruta: 'CANCÚN → CHIHUAHUA' },
    { flight: 'AM 531',  hora: '13:40', pickup: '9:50',  ruta: 'CANCÚN → MÉXICO' },
    { flight: 'VB 2062', hora: '13:40', pickup: '9:50',  ruta: 'CANCÚN → QUERÉTARO' },
    { flight: 'VB 2104', hora: '13:45', pickup: '9:50',  ruta: 'CANCÚN → VERACRUZ' },
    { flight: 'Y4 3081', hora: '14:10', pickup: '10:40', ruta: 'CANCÚN → TIJUANA' },
    { flight: 'VB 1023', hora: '14:35', pickup: '11:10', ruta: 'CANCÚN → MÉXICO' },
    { flight: 'VB 2264', hora: '15:45', pickup: '12:10', ruta: 'CANCÚN → TIJUANA' },
    { flight: 'AM 549',  hora: '17:48', pickup: '14:20', ruta: 'CANCÚN → MÉXICO' },
    { flight: 'Y4 5589', hora: '19:40', pickup: '14:20', ruta: 'CANCÚN → MONTERREY' },
  ],
};

function Traslados({ onBack }) {
  const tabs = Object.keys(trasladosData);
  const [activeDate, setActiveDate] = useState(tabs[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const allFlights = trasladosData[activeDate] || [];
  const flights = searchTerm.trim()
    ? allFlights.filter(f =>
        f.flight.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.ruta.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allFlights;

  return (
    <div className="traslados-container animate-fade-in">
      {/* Header */}
      <div className="perfil-header-area">
        <div className="perfil-header-text">
          <h1>Vuelos y Traslados</h1>
          <div className="perfil-header-subtitle">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="#008fb4" style={{flexShrink: 0}}>
                <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
              </svg>
            <span>IO SUMMIT 2026 • Playa del Carmen</span>
          </div>
        </div>
        <div className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Date Tabs */}
      <div className="traslados-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`traslados-tab ${activeDate === tab ? 'active' : ''}`}
            onClick={() => setActiveDate(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="traslados-search">
        <span className="material-icons-round traslados-search-icon">search</span>
        <input
          type="text"
          placeholder="Buscar por vuelo o destino..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="traslados-search-input"
        />
        {searchTerm && (
          <span
            className="material-icons-round traslados-search-clear"
            onClick={() => setSearchTerm('')}
          >close</span>
        )}
      </div>

      {/* Flight Cards */}
      <div className="traslados-content">
        {flights.map((f, idx) => (
          <div className="flight-card" key={idx}>
            {/* Top row: flight number + route */}
            <div className="flight-card-top">
              <span className="flight-number">{f.flight}</span>
              <span className="flight-type">{f.ruta}</span>
            </div>

            {/* Times row */}
            <div className="flight-times-row">
              <div className="flight-time-block">
                <span className="flight-time-large">{f.hora}</span>
                <span className="flight-city-small">SALIDA</span>
              </div>

              <div className="flight-line-divider">
                <div className="flight-line"></div>
                <span className="material-icons-round flight-plane-icon">
                  {f.flight.startsWith('TERRESTRE') ? 'directions_bus' : 'flight'}
                </span>
              </div>

              <div className="flight-time-block right">
                <span className="flight-time-large">{f.ruta.split('→')[1]?.trim() || ''}</span>
                <span className="flight-city-small">DESTINO</span>
              </div>
            </div>

            {/* Transfer pickup */}
            <div className="flight-transfer-info">
              <div className="flight-transfer-icon">
                <span className="material-icons-round">directions_bus</span>
              </div>
              <div className="flight-transfer-details">
                <span className="flight-transfer-label">PICK UP EN HOTEL</span>
                <span className="flight-transfer-time">
                  {f.pickup ? f.pickup + ' hrs' : 'Sin traslado asignado'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Traslados;
