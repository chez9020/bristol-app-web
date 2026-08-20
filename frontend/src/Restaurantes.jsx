import React from 'react';
import './Agenda.css';
import './Restaurantes.css';

const restaurantesData = [
  { id: 1, name: "Mo's Burgers & Shakes", type: 'Estadounidense', img: '/assets/rest_mo_burgers.png' },
  { id: 2, name: 'Izakaya Cuisine', type: 'Asiática', img: '/assets/rest_izakaya.png' },
  { id: 3, name: 'Cevichería by la Isla', type: 'Pescados y mariscos', img: '/assets/rest_ceviche_isla.png' },
  { id: 4, name: 'Mikado', type: 'Japonesa Teppanyaki', img: '/assets/rest_mikado.png' },
  { id: 5, name: 'Mexican Cuisine', type: 'Mexicana', img: '/assets/rest_mexican_cuisine.png' },
  { id: 6, name: 'Restaurante Italiano', type: 'Restaurante italiano', img: '/assets/rest_italiano.png' },
  { id: 7, name: 'Hana Polynesian Grill', type: 'Cocina polinesia', img: '/assets/rest_hana_polynesian.png' },
  { id: 8, name: 'Pizzeria by La Isla', type: 'Pizza', img: '/assets/rest_pizzeria_isla.png' },
  { id: 9, name: 'Mediterranean Restaurant', type: 'Internacional', img: '/assets/rest_mediterranean.png' },
  { id: 10, name: 'Botanika by La Isla', type: 'Cocina libanesa', img: '/assets/rest_botanika_isla.png' },
  { id: 11, name: 'The Great Room', type: 'Lobby bar', img: '/assets/rest_great_room.png' },
  { id: 12, name: '750 Pizzería', type: 'Pizza', img: '/assets/rest_750_pizzeria.png' }
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
              <div className="rest-type-text">{rest.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurantes;
