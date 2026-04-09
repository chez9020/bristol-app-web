import React, { useState } from 'react';
import './Restaurantes.css';

const restaurantesData = [
  {
    id: 1,
    name: 'Tora Cancún',
    category: 'Premium',
    img: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: 'https://maps.app.goo.gl/thBx6kdUwBPmosGk6',
  },
  {
    id: 2,
    name: 'Rosa negra Cancún',
    category: 'Premium',
    img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: 'https://maps.app.goo.gl/mFaUYHBFNLQ8P77a7',
  },
  {
    id: 3,
    name: 'Puerto santo',
    category: 'Comida Mexicana',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: 'https://maps.app.goo.gl/dKrzZ8iMUvBuyLch6',
  },
  {
    id: 4,
    name: 'Puerto madero',
    category: 'Premium',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: 'https://maps.app.goo.gl/9PigKSoCmaKWRyS4A',
  },
  {
    id: 5,
    name: 'Freds seafood & raw bar',
    category: 'Premium',
    img: 'https://images.unsplash.com/photo-1551731591-224443a39e8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: 'https://maps.app.goo.gl/gZj5G3ZMWvnGGsP59',
  },
  {
    id: 6,
    name: 'Ilios Cancún',
    category: 'Premium',
    img: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: 'https://maps.app.goo.gl/1CxWnv1XY7cajmco9',
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
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
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
