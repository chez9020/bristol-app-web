import { useState } from 'react';
import './Inicio.css'; // We'll create this specific CSS file next

function Inicio({ onEnterMission }) {
  return (
    <div className="inicio-container">
      {/* Background Image completely covering the screen */}
      <div className="inicio-background">
        <img src="/assets/bg_home.png" alt="Agents Background" />
      </div>

      {/* Top Gradient to make Logo visible */}
      <div className="top-gradient-overlay"></div>

      {/* Top Logo */}
      <div className="bms-logo-container">
        <img src="/assets/bms_logo.png" alt="Bristol Myers Squibb" />
      </div>

      {/* Bottom Content Area */}
      <div className="bottom-content-area">
        {/* Title */}
        <h1 className="welcome-title">
          BIENVENIDO<br/>AGENTE IO
        </h1>

        {/* Subtitle */}
        <p className="welcome-subtitle">
          Tu guía para vivir<br/>la experiencia completa.
        </p>

        {/* Action Button */}
        <button className="primary-enter-button" onClick={onEnterMission}>
          <span>Entrar a la misión </span>
          <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 -960 960 960" fill="#f7f7f7ff" style={{verticalAlign: 'middle', marginLeft: '4px'}}>
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>

        {/* Bottom Code */}
        <div className="bottom-code-indicator">
          7356-MX-2600009
        </div>
      </div>
    </div>
  );
}

export default Inicio;
