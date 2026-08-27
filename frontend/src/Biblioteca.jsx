import React, { useState, useEffect } from 'react';
import './Agenda.css';
import './Biblioteca.css';

const ICON_FALLBACK = '/assets/icon_biblioteca_datos.svg';

function Biblioteca({ onBack }) {
  const [busqueda, setBusqueda] = useState('');
  const [presentaciones, setPresentaciones] = useState([]);

  useEffect(() => {
    fetch('/api/biblioteca/presentaciones')
      .then((res) => res.json())
      .then(setPresentaciones)
      .catch((e) => console.error('Error cargando presentaciones', e));
  }, []);

  const presentacionesFiltradas = presentaciones.filter((p) => {
    const q = busqueda.toLowerCase();
    return p.titulo.toLowerCase().includes(q) || p.ponente.toLowerCase().includes(q);
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

          {presentacionesFiltradas.length === 0 ? (
            <p className="biblioteca-empty">Sin presentaciones disponibles por el momento.</p>
          ) : (
            <div className="biblioteca-grid">
              {presentacionesFiltradas.map((p) => (
                <div className="biblioteca-card" key={p.id}>
                  <div className="biblioteca-card-icon-area">
                    {p.portada_url ? (
                      <img src={p.portada_url} alt="" className="biblioteca-card-portada" />
                    ) : (
                      <img src={ICON_FALLBACK} alt="" />
                    )}
                  </div>
                  <div className="biblioteca-card-body">
                    <h3>{p.titulo}</h3>
                    <p className="biblioteca-card-author">{p.ponente}</p>
                    <button
                      className="biblioteca-descargar-btn"
                      onClick={() => window.open(p.archivo_url, '_blank')}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Biblioteca;
