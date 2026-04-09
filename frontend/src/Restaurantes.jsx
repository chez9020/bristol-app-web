import React, { useState } from 'react';
import './Restaurantes.css';

const restaurantesData = [
  {
    id: 1,
    name: 'Tora Cancún',
    category: 'Premium',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante1.png',
    link: 'https://maps.app.goo.gl/gyxEAjbK1Eean4D79?g_st=ic',
  },
  {
    id: 2,
    name: 'RosaNegra Cancún',
    category: 'Premium',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante2.png',
    link: 'https://maps.app.goo.gl/pqothSL35pHYS3TZ7?g_st=ic',
  },
  {
    id: 3,
    name: 'Puerto Santo Cancún',
    category: 'Comida Mexicana',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante3.png',
    link: 'https://maps.app.goo.gl/y6Gh6NF6tbjFnHFu7?g_st=ic',
  },
  {
    id: 4,
    name: 'Puerto Madero Cancún',
    category: 'Premium',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante4.png',
    link: 'https://maps.app.goo.gl/Ti5q6tUQUXS1npnA6?g_st=ic',
  },
  {
    id: 5,
    name: 'Fred’s Seafood & Raw Bar',
    category: 'Premium',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante5.png',
    link: 'https://maps.app.goo.gl/MF8jspukT5RnB4qs8?g_st=ic',
  },
  {
    id: 6,
    name: 'Ilios Cancún',
    category: 'Premium',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante6.png',
    link: 'https://maps.app.goo.gl/sFYd8WAo3ryw2g93A?g_st=ic',
  },
  {
    id: 7,
    name: 'Fish Fritanga',
    category: 'Premium',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante7.png',
    link: 'https://maps.app.goo.gl/1KapBSTe8SAxBb9n9?g_st=ic',
  },
  {
    id: 8,
    name: 'La Dolce Vita Cancún',
    category: 'Premium',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante8.png',
    link: 'https://maps.app.goo.gl/MrGBRSBtVLMkeuBi9?g_st=ic',
  },
  {
    id: 9,
    name: 'Porfirio’s Cancún',
    category: 'Comida Mexicana',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante9.png',
    link: 'https://maps.app.goo.gl/MBLehw5r7ghSBRdX9?g_st=ic',
  },
  {
    id: 10,
    name: 'Mochomos',
    category: 'Premium',
    img: 'https://storage.googleapis.com/bristol-presentaciones-2026/Restaurantes/restaurante10.png',
    link: 'https://maps.app.goo.gl/a9pBSadVSbn7NoA7A?g_st=ic',
  },
];

const categories = ['Todos', 'Comida Mexicana', 'Premium'];

function Restaurantes({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredRestaurantes = restaurantesData.filter(r =>
    activeFilter === 'Todos' ? true : r.category === activeFilter
  );

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
              <a href={rest.link} className="rest-location-link" target="_blank" rel="noopener noreferrer">
                <span className="material-icons-round">location_on</span>
                Ir a ubicación
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurantes;
