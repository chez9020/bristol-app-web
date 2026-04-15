import { useState } from 'react';
import './Registro.css';

function Registro({ onRegister }) {
  const [name, setName] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [showId, setShowId] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // Modal state
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
              <button
                type="button"
                className="policy-details-link-btn"
                onClick={() => setShowPrivacyModal(true)}
              >
                Ver Política
              </button>
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

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="privacy-modal-overlay">
          <div className="privacy-modal-content">
            <div className="privacy-modal-header">
              <h3>Aviso de Privacidad</h3>
              <button className="privacy-close-btn" onClick={() => setShowPrivacyModal(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="privacy-pdf-container">
              {/* Replace with your actual bucket URL */}
              <iframe
                src="https://storage.googleapis.com/bristol-presentaciones-2026/Aviso%20de%20Privacidad/AVISO%20DE%20PRIVACIDAD%20(CAMZYOS).pdf"
                title="Aviso de Privacidad"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registro;
