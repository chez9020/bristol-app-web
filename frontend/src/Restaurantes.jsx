import React, { useState } from 'react';
import './Restaurantes.css';

const restaurantesData = [
  { id: 1, name: 'Gastro Hall', type: 'Buffet Internacional', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante1.png?v=2' },
  { id: 2, name: 'Vibra', type: 'Cocina Internacional', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante2.png?v=2' },
  { id: 3, name: 'Santé', type: 'Cocina Mediterránea', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante3.png?v=2' },
  { id: 4, name: 'Sal Steak Cave', type: 'Steak house', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante4.png?v=2' },
  { id: 5, name: 'Cappella', type: 'Cocina italiana', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante5.png?v=2' },
  { id: 6, name: 'Blue Agave', type: 'Auténtica Taquería', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante6.png?v=2' },
  { id: 7, name: 'Kao', type: 'Cocina fusión asiática', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante7.png?v=2' },
  { id: 8, name: 'Agua Marina', type: 'Cocina de mariscos', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante8.png?v=2' },
  { id: 9, name: 'Coffee Corner by Nespresso', type: 'Cafetería', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante9.png?v=2' },
  { id: 10, name: 'Ginger Lounge Bar', type: 'Bar', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante10.png?v=2' },
  { id: 11, name: 'Pool Bar', type: 'Bar', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante11.png?v=2' },
  { id: 12, name: 'The Shack', type: 'Snacks', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante12.png?v=2' },
  { id: 13, name: 'Zesty', type: 'Cocina con producto local', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante13.png?v=2' },
  { id: 14, name: 'Twe12lvet', type: 'Heladería', img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante14.png?v=2' }
];

const categories = ['Todos'];

function Restaurantes({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredRestaurantes = restaurantesData;

  return (
    <div className="restaurantes-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Restaurantes</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>place</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
        </div>
      </header>

      <div className="restaurantes-filters-wrapper">
        <div className="restaurantes-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat !== 'Todos' && <span className="material-icons-round filter-icon">restaurant</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="restaurantes-grid">
        {filteredRestaurantes.map((rest) => (
          <div className="restaurante-card" key={rest.id}>
            <div className="rest-hero">
              <img src={rest.img} alt={rest.name} />
            </div>
            <div className="rest-info">
              <h3>{rest.name}</h3>
              <div className="rest-type-text">
                {rest.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurantes;
