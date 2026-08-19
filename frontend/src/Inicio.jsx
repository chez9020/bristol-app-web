import './Inicio.css';

function Inicio({ onEnterMission }) {
  return (
    <div className="inicio-container">
      {/* Background Image completely covering the screen */}
      <div className="inicio-background">
        <img src="/assets/blood2026_home_bg.png" alt="Blood 2026 Background" />
      </div>

      {/* Top Logo (BMS) - Fixed at the top */}
      <div className="bms-logo-top">
        <img src="/assets/bms_logo_color.svg" alt="Bristol Myers Squibb" />
      </div>

      {/* Bottom Content Area - Fixed at the bottom of screen */}
      <div className="bottom-interactive-area">
        {/* Title */}
        <h1 className="main-event-title">
          bLOOD 2026
        </h1>

        <h2 className="main-welcome-title">
          Bienvenidos
        </h2>

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
          HE-MX-2600018
        </div>
      </div>
    </div>
  );
}

export default Inicio;
