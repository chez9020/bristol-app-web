import React, { useState } from 'react';
import './Restaurantes.css';

const restaurantesData = [
  {
    id: 1,
    name: 'Así Restaurant & Beach Club',
    category: 'Comida Mexicana',
    img: '/restaurante-1.png',
    link: 'https://maps.app.goo.gl/thBx6kdUwBPmosGk6',
  },
  {
    id: 2,
    name: 'La Cueva Del Chango',
    category: 'Comida Mexicana',
    img: '/restaurante-2.png',
    link: 'https://maps.app.goo.gl/mFaUYHBFNLQ8P77a7',
  },
  {
    id: 3,
    name: 'El Fogón',
    category: 'Comida Mexicana',
    img: '/restaurante-3.png',
    link: 'https://maps.app.goo.gl/dKrzZ8iMUvBuyLch6',
  },
  {
    id: 4,
    name: 'Zitla',
    category: 'Comida Mexicana',
    img: '/restaurante-4.png',
    link: 'https://maps.app.goo.gl/9PigKSoCmaKWRyS4A',
  },
  {
    id: 5,
    name: 'Harry\'s',
    category: 'Premium',
    img: '/restaurante-5.PNG',
    link: 'https://maps.app.goo.gl/gZj5G3ZMWvnGGsP59',
  },
  {
    id: 6,
    name: 'Maison Oh Lala',
    category: 'Premium',
    img: '/restaurante-6.png',
    link: 'https://maps.app.goo.gl/1CxWnv1XY7cajmco9',
  },
  {
    id: 7,
    name: 'Ilios',
    category: 'Premium',
    img: '/restaurante-7.png',
    link: 'https://maps.app.goo.gl/zXBswQ6RfHzNK3437',
  },
  {
    id: 8,
    name: 'Alux',
    category: 'Premium',
    img: '/restaurante-8.png',
    link: 'https://maps.app.goo.gl/hN1zErYvCRxQryK47',
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
      {/* Header */}
      <div className="perfil-header-area">
        <div className="perfil-header-text">
          <h1>Restaurantes</h1>
          <div className="perfil-header-subtitle">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 -960 960 960" fill="#008fb4" style={{flexShrink: 0}}>
              <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 52 136-52 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-52-136 52Zm34-114 102-38 102 38 56-96 108-24-10-112 74-84-74-84 10-112-108-24-56-96-102 38-102-38-56 96-108 24 10 112-74 84 74 84-10 112 108 24 56 96Zm102-124 204-204-58-54-146 148-72-72-56 56 128 126Zm0-182Z"/>
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

      {/* Filters (Chips) */}
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

      {/* Grid of Restaurants */}
      <div className="restaurantes-grid-container">
        <div className="restaurantes-grid">
          {filteredRestaurantes.map((rest) => (
            <div className="restaurante-card" key={rest.id}>
              <div className="rest-hero">
                <img src={rest.img} alt={rest.name} className="rest-img" />
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
    </div>
  );
}

export default Restaurantes;
