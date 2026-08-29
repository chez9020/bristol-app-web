import React, { useState } from 'react';
import './Agenda.css';
import './Logistica.css';
import './Traslados.css';
import { VUELOS, cityCode } from './trasladosData';

function FlightCard({ vuelo }) {
  const destFull = vuelo.ruta.split(' - ')[1];

  return (
    <div className="flight-glass-card">
      <div className="traslado-badge-row">
        <span className="traslado-nos-badge">{vuelo.vuelo}</span>
        <span className="traslado-salida-tag">SALIDA • {vuelo.sale}</span>
      </div>

      <div className="logi-route-info">
        <div className="logi-route-point">
          <span className="logi-route-time">{vuelo.sale}</span>
          <span className="logi-route-city">CUN</span>
        </div>
        <div className="logi-flight-path">
          <div className="logi-path-line"></div>
          <img src="/assets/icon_flight_small.svg" alt="" className="logi-path-plane-icon" />
        </div>
        <div className="logi-route-point">
          <span className="logi-route-time">{cityCode(vuelo.ruta)}</span>
          <span className="logi-route-city">{destFull}</span>
        </div>
      </div>

      <div className="logi-transfer-inner-card">
        <img src="/assets/icon_transfer_bus.svg" alt="" className="logi-transfer-icon-box" />
        <div className="logi-transfer-text-block">
          <span className="logi-transfer-label-small">RECOGIDA EN HOTEL</span>
          <span className="logi-transfer-time-val">{vuelo.pickup}</span>
        </div>
      </div>
    </div>
  );
}

function Traslados({ onBack }) {
  const [selectedDay, setSelectedDay] = useState('29');
  const vuelosDelDia = VUELOS.filter((v) => v.dia === selectedDay);

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
          className={`day-tab ${selectedDay === '29' ? 'active' : ''}`}
          onClick={() => setSelectedDay('29')}
        >
          29 Agosto
        </button>
        <button
          className={`day-tab ${selectedDay === '30' ? 'active' : ''}`}
          onClick={() => setSelectedDay('30')}
        >
          30 Agosto
        </button>
      </div>

      <p className="traslados-nota">
        El pick up sale del lobby del hotel a la hora indicada. Preséntate 10 minutos antes.
      </p>

      <div className="traslados-list-wrapper">
        {vuelosDelDia.map((v, idx) => (
          <FlightCard key={`${v.vuelo}-${v.pickup}-${idx}`} vuelo={v} />
        ))}
      </div>
    </div>
  );
}

export default Traslados;
