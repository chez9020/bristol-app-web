import { useState } from 'react';
import './Registro.css';

function Registro({ onRegister }) {
  const [name, setName] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [showId, setShowId] = useState(false); // New state for visibility toggle
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validar que sean exactamente 6 números para el acceso
  const isFormValid = /^\d{6}$/.test(name) && acceptedPolicy && !isLoading;

  const handleContinue = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isFormValid) {
      setIsLoading(true);
      try {
        // Mantenemos la llamada a /api/login con id_unico. 
        // Si el usuario ingresa su nombre aquí, el backend podría necesitar ajustes.
        // Pero el diseño pide "Nombre completo". 
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_unico: name }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem('agenteSession', JSON.stringify({
            agente: data.agente,
            timestamp: new Date().getTime()
          }));
          onRegister(data.agente);
        } else {
          setErrorMessage(data.detail || "ID Invalido. Misión rechazada.");
        }
      } catch (error) {
        setErrorMessage("Error de conexión con el servidor. Intenta nuevamente.");
        console.error("Error calling login API:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (!acceptedPolicy) {
      setErrorMessage("Por favor, acepta la política de privacidad.");
    } else {
      setErrorMessage("Por favor, ingresa tu información.");
    }
  };

  return (
    <div className="registro-container">
      {/* Background Image */}
      <div className="registro-background">
        <img src="/assets/camzyos_registro_bg.png" alt="Camzyos Background" />
      </div>

      {/* Top Logo */}
      <div className="registro-logo-top">
        <img src="/assets/bms_logo.png" alt="Bristol Myers Squibb" className="white-logo" />
      </div>

      {/* Main Container Overlay */}
      <div className="registro-overlay-card">
        <div className="registro-header-modern">
          <h1>Regístrate</h1>
          <p>Ingresa el ID unico que llego a tu correo.</p>
        </div>

        <form className="registro-form-modern" onSubmit={handleContinue}>
          <div className="input-field-group">
            <input
              type={showId ? 'text' : 'password'}
              placeholder="ID unico (6 dígitos)"
              value={name}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setName(val);
              }}
              className="registro-input-modern"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowId(!showId)}
            >
              <span className="material-icons-round">
                {showId ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          <div className="checkbox-agreement-group">
            <div
              className={`modern-checkbox ${acceptedPolicy ? 'active' : ''}`}
              onClick={() => setAcceptedPolicy(!acceptedPolicy)}
            >
              {acceptedPolicy && <span className="material-icons-round check-icon-modern">check</span>}
            </div>
            <div className="agreement-text-container">
              <span className="agreement-label" onClick={() => setAcceptedPolicy(!acceptedPolicy)}>
                Acepto la <strong>Política de Privacidad</strong>
              </span>
              <a href="#" className="policy-details-link">Ver Política</a>
            </div>
          </div>

          {errorMessage && (
            <p className="registro-error-text">
              {errorMessage}
            </p>
          )}
        </form>
      </div>

      {/* Action Button - Outside the card to match design positioning */}
      <div className="registration-action-container">
        <button
          onClick={handleContinue}
          className={`registro-continue-button ${!isFormValid || isLoading ? 'disabled' : ''}`}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Accediendo...' : 'Continuar'}
        </button>
      </div>

      {/* Bottom Code Indicator */}
      <div className="legal-reference-footer">
        3500-MX-2600044
      </div>
    </div>
  );
}

export default Registro;
