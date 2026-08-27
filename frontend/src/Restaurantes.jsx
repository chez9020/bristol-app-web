import React from 'react';
import './Agenda.css';
import './Restaurantes.css';

const restaurantesData = [
  { id: 1, name: 'Toscanni', horario: 'Desayuno 6:30 - 11:30\nCena 17:30 - 23:00', img: '/assets/rest_toscanni.png' },
  { id: 2, name: 'Mikado | Teppanyaky', horario: 'Cenas 17:00 - 23:00', img: '/assets/rest_mikado_teppanyaki.png' },
  { id: 3, name: 'Mikado | Kasai', horario: 'Cenas 17:30 - 23:00', img: '/assets/rest_mikado_kasai.png' },
  { id: 4, name: 'Hana', horario: 'Cenas 17:30 - 23:00', img: '/assets/rest_hana.png' },
  { id: 5, name: 'Casa Madre', horario: 'Cenas 17:30 - 22:00', img: '/assets/rest_casamadre.png' },
  { id: 6, name: 'Delphina', horario: 'Cenas 17:30 - 22:00', img: '/assets/rest_delphina.png' },
  { id: 7, name: 'Champions', horario: 'Cenas/Bar 15:00 - 00:00', img: '/assets/rest_champions.png' },
];

function Restaurantes({ onBack }) {
  return (
    <div className="restaurantes-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Restaurantes</h1>
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

      <div className="restaurantes-grid">
        {restaurantesData.map((rest) => (
          <div className="restaurante-card" key={rest.id}>
            <div className="rest-hero">
              <img src={rest.img} alt={rest.name} />
            </div>
            <div className="rest-info">
              <h3>{rest.name}</h3>
              {rest.horario.split('\n').map((line, i) => (
                <div className="rest-type-text" key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="restaurantes-footer-disclaimer">HE-MX-2600018</p>
    </div>
  );
}

export default Restaurantes;
