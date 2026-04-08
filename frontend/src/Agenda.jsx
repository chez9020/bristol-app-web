import { useState } from 'react';
import './Agenda.css';

function Agenda({ onBack }) {
  const [activeDay, setActiveDay] = useState('Viernes');

  return (
    <div className="agenda-container animate-fade-in">
      <div className="perfil-header-area">
        <div className="perfil-header-text">
          <h1>Agenda</h1>
          <div className="perfil-header-subtitle">
            <span className="material-icons-round">event_note</span>
            <span>IO SUMMIT 2026 • Playa del Carmen</span>
          </div>
        </div>
        <div className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="days-selector">
        <div 
          className={`day-btn ${activeDay === 'Viernes' ? 'active' : ''}`}
          onClick={() => setActiveDay('Viernes')}
        >
          <span className="day-btn-title">Viernes</span>
          <span className="day-btn-date">06 Marzo</span>
        </div>
        <div 
          className={`day-btn ${activeDay === 'Sábado' ? 'active' : ''}`}
          onClick={() => setActiveDay('Sábado')}
        >
          <span className="day-btn-title">Sábado</span>
          <span className="day-btn-date">07 Marzo</span>
        </div>
      </div>

      <div className="day-banner">
        {activeDay === 'Viernes' ? 'Viernes 6 de Marzo' : 'Sábado 7 de Marzo'}
      </div>

      <div className="agenda-list">
        {activeDay === 'Viernes' ? (
          <>
            <div className="agenda-item">
              <span className="agenda-time">19:00 - 19:05</span>
              <span className="agenda-title">Apertura y bienvenida</span>
              <span className="agenda-presenter-name">IO Business Unit Leaders</span>
            </div>
            
            <div className="agenda-item">
              <span className="agenda-time">19:05 - 19:30</span>
              <span className="agenda-title">IA 2026: Estrategia, Tendencias y Cómo Construir Soluciones en Minutos</span>
              <div className="agenda-presenter">
                <span className="agenda-presenter-name">Pepe Ocadiz</span>
                <span className="agenda-presenter-role">Omnichannel Strategy AD - BMS</span>
              </div>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">19:30 - 21:00</span>
              <span className="agenda-module">MÓDULO TÓRAX</span>
              <span className="agenda-title">
                ¿Por qué la durabilidad redefine la elección de tratamiento en CPCNP? Evidencia que guía decisiones más allá de la respuesta inicial
              </span>
              <div className="agenda-panelists">
                <span className="agenda-panelist">Coordinadora: Dra. Vanesaa García (Oncare)</span>
                <span className="agenda-panelist">Dra. Carmen Puparelli (Inst. Alexander Fleming)</span>
                <span className="agenda-panelist">Dr. Luis Cabrera (Instituto Nacional de Cancerología)</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="agenda-item">
              <span className="agenda-time">8:00 - 8:05</span>
              <span className="agenda-title">Bienvenida</span>
              <span className="agenda-presenter-name">IO Business Unit Leaders</span>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">8:05 - 9:35</span>
              <span className="agenda-module">MÓDULO GI</span>
              <span className="agenda-title">
                Tumores Gastroesofágicos, una nueva era en su abordaje terapéutico con IO y su impacto en la práctica clínica.
              </span>
              <div className="agenda-panelists">
                <span className="agenda-panelist">Coordinador: Dr. Daniel Motola (Médica Sur)</span>
                <span className="agenda-panelist">Dr. Stefano Kim (Sanatorio Allende)</span>
                <span className="agenda-panelist">Dr. Ricardo Fernández Ferreyra (PEMEX Sur)</span>
              </div>
            </div>

            <div className="agenda-item" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
              <span className="agenda-time">9:35 - 9:50</span>
              <span className="agenda-title" style={{color: '#cbd5e1'}}>Coffee Break</span>
              <span className="agenda-presenter-name">Panel de Expertos</span>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">9:50 - 11:20</span>
              <span className="agenda-module">MÓDULO MELANOMA</span>
              <span className="agenda-title">
                Del Perfil Clínico a la Decisión Terapéutica: Insights Reales y Perspectiva de LAG-3
              </span>
              <div className="agenda-panelists">
                <span className="agenda-panelist">Coordinadora: Dra. María Isabel Enriquez Aceves (Hospital Regional ISSSTE León)</span>
                <span className="agenda-panelist">Dra. Gabriela Cinat (Sanatorio Finochietto)</span>
                <span className="agenda-panelist">Dr. Rodrigo Riera (Centro Médico Nacional SIGLO XXI)</span>
              </div>
            </div>

            <div className="agenda-item" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
              <span className="agenda-time">11:20 - 11:35</span>
              <span className="agenda-title" style={{color: '#cbd5e1'}}>Coffee Break</span>
              <span className="agenda-presenter-name">Panel de Expertos</span>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">11:35 - 13:05</span>
              <span className="agenda-module">MÓDULO GU</span>
              <span className="agenda-title">
                Tomando Decisiones Críticas en RCC: De la Evidencia a la Práctica Real
              </span>
              <div className="agenda-panelists">
                <span className="agenda-panelist">Coordinadora: Dra. María Teresa Bourlon (Instituto Nacional de Ciencias Médicas y Nutrición Salvador Zubirán)</span>
                <span className="agenda-panelist">Dr. Juan Pablo Sade (Instituto Alexander Fleming)</span>
                <span className="agenda-panelist">Dra. Regina Barragán (Instituto Nacional de Cancerología)</span>
              </div>
            </div>

            <div className="agenda-item" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
              <span className="agenda-time">13:05 - 13:15</span>
              <span className="agenda-title" style={{color: '#cbd5e1'}}>Break</span>
              <span className="agenda-presenter-name">Panel de Expertos</span>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">13:15 - 13:45</span>
              <span className="agenda-title">Expert Meeting Melanoma / Tórax / GI / GU</span>
              <span className="agenda-presenter-name">Panel de Expertos</span>
            </div>

            <div className="agenda-item" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
              <span className="agenda-time">13:45 - 13:50</span>
              <span className="agenda-title" style={{color: '#cbd5e1'}}>Rotación</span>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">13:50 - 14:20</span>
              <span className="agenda-title">Expert Meeting Melanoma / Tórax / GI / GU</span>
              <span className="agenda-presenter-name">Panel de Expertos</span>
            </div>

            <div className="agenda-item" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
              <span className="agenda-time">14:20 - 14:25</span>
              <span className="agenda-title" style={{color: '#cbd5e1'}}>Rotación</span>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">14:25 - 14:55</span>
              <span className="agenda-title">Expert Meeting Melanoma / Tórax / GI / GU</span>
              <span className="agenda-presenter-name">Panel de Expertos</span>
            </div>

            <div className="agenda-item" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
              <span className="agenda-time">14:55 - 15:00</span>
              <span className="agenda-title" style={{color: '#cbd5e1'}}>Rotación</span>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">15:00 - 15:30</span>
              <span className="agenda-title">Expert Meeting Melanoma / Tórax / GI / GU</span>
              <span className="agenda-presenter-name">Panel de Expertos</span>
            </div>

            <div className="agenda-item" style={{backgroundColor: 'rgba(0, 143, 180, 0.2)'}}>
              <span className="agenda-time">15:30 - 16:30</span>
              <span className="agenda-title" style={{color: '#008fb4'}}>Comida</span>
            </div>

            <div className="agenda-item">
              <span className="agenda-time">16:30 - 17:00</span>
              <span className="agenda-title">Cierre</span>
              <span className="agenda-presenter-name">IO Business Unit Leaders</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Agenda;
