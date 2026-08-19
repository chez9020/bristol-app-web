import React, { useState } from 'react';
import './Agenda.css';
import './Biblioteca.css';

const PRESENTACIONES = [
  {
    id: 1,
    categoria: 'HEMATOLOGÍA',
    titulo: 'Avances en Leucemia Mieloide',
    autor: 'Dr. Roberto Gómez',
    icon: '/assets/icon_biblioteca_hematologia.svg',
  },
  {
    id: 2,
    categoria: 'GENÓMICA',
    titulo: 'Terapia Génica en Linfomas',
    autor: 'Dra. Elena Ruiz',
    icon: '/assets/icon_biblioteca_genomica.svg',
  },
  {
    id: 3,
    categoria: 'CLÍNICA',
    titulo: 'Nuevos Protocolos de Transfusión',
    autor: 'Dr. Carlos Maza',
    icon: '/assets/icon_biblioteca_clinica.svg',
  },
  {
    id: 4,
    categoria: 'DATOS',
    titulo: 'Manejo de Datos en Hematología',
    autor: 'Ing. Sofía Ortiz',
    icon: '/assets/icon_biblioteca_datos.svg',
  },
];

function Biblioteca({ onBack }) {
  const [busqueda, setBusqueda] = useState('');

  const presentacionesFiltradas = PRESENTACIONES.filter((p) => {
    const q = busqueda.toLowerCase();
    return p.titulo.toLowerCase().includes(q) || p.autor.toLowerCase().includes(q);
  });

  return (
    <div className="biblioteca-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Biblioteca</h1>
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

      <div className="biblioteca-content">
        <div className="search-filter-bar">
          <img src="/assets/icon_search_purple.svg" alt="" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por tema o ponente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="filter-btn">
            <img src="/assets/icon_filter_lines.svg" alt="" />
          </button>
        </div>

        <section className="biblioteca-section">
          <h2>Presentaciones</h2>
          <p className="biblioteca-section-subtitle">Accede a todo el material científico del evento.</p>

          <div className="biblioteca-grid">
            {presentacionesFiltradas.map((p) => (
              <div className="biblioteca-card" key={p.id}>
                <div className="biblioteca-card-icon-area">
                  <img src={p.icon} alt="" />
                  <span className="biblioteca-card-badge">{p.categoria}</span>
                </div>
                <div className="biblioteca-card-body">
                  <h3>{p.titulo}</h3>
                  <p className="biblioteca-card-author">{p.autor}</p>
                  <button className="btn-premium-gradient" style={{ width: '100%' }}>
                    Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Biblioteca;
