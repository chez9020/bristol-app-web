import { useState } from 'react';
import './Inicio.css'; // We'll create this specific CSS file next

function Inicio({ onEnterMission }) {
  return (
    <div className="inicio-container">
      {/* Background Image completely covering the screen */}
      <div className="inicio-background">
        <img src="/assets/camzyos_home_bg.png" alt="Camzyos Background" />
      </div>

      {/* Top Logo (BMS) - Fixed at the top */}
      <div className="bms-logo-top">
        <img src="/assets/bms_logo.png" alt="Bristol Myers Squibb" className="white-logo" />
      </div>

      {/* Bottom Content Area - Fixed at the bottom 45% of screen */}
      <div className="bottom-interactive-area">
        {/* Logo Camzyos */}
        <div className="branding-container">
          <img src="/logo_camyoz.png" alt="Camzyos Logo" className="camzyos-main-logo" />
        </div>

        {/* Title */}
        <h1 className="main-welcome-title">
          Bienvenidos
        </h1>

        {/* Subtitle */}
        <p className="main-welcome-subtitle">
          Tu guía para vivir<br/>la experiencia completa.
        </p>

        {/* Action Button */}
        <button className="camzyos-primary-button" onClick={onEnterMission}>
          <span>Comenzar</span>
        </button>

        {/* Bottom Code Indicator */}
        <div className="legal-reference-bottom">
          3500-MX-2600044
        </div>
      </div>
    </div>
  );
}

export default Inicio;
