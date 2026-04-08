import { useState } from 'react';
import './Registro.css';

function Registro({ onRegister }) {
  const [name, setName] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [showId, setShowId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validar que sean exactamente 6 números
  const isValidId = /^\d{6}$/.test(name);
  const isFormValid = isValidId && acceptedPolicy && !isLoading;

  const handleContinue = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (isFormValid) {
      setIsLoading(true);
      try {
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
      setErrorMessage("Por favor, ingresa un ID válido de 6 números.");
    }
  };

  return (
    <div className="registro-container">
      {/* Background Image */}
      <div className="registro-background">
        <img src="/assets/bg_registro.png" alt="Agents Background" />
      </div>

      {/* Top Logo */}
      <div className="registro-logo-container">
        <img src="/assets/bms_logo.png" alt="Bristol Myers Squibb" />
      </div>

      {/* Main Glass Panel */}
      <div className="registro-glass-panel">
        <div className="registro-header">
          <h1>Regístrate</h1>
          <p>Ingresa el ID unico que llego a tu correo para continuar la misión.</p>
        </div>

        <form className="registro-form" onSubmit={handleContinue}>
          <div className="input-group" style={{ position: 'relative' }}>
            <input 
              type={showId ? 'text' : 'password'}
              placeholder="ID ÚNICO (6 dígitos)" 
              value={name}
              onChange={(e) => {
                // Solo permitir números y limitar a 6 caracteres
                const onlyNumbers = e.target.value.replace(/\D/g, '').slice(0, 6);
                setName(onlyNumbers);
              }}
              className="registro-input"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowId(!showId)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.5)'
              }}
            >
              {showId ? (
                // Eye-off icon (hide)
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Z"/>
                </svg>
              ) : (
                // Eye icon (show)
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
                </svg>
              )}
            </button>
          </div>

          <div className="checkbox-group">
            <div 
              className={`custom-checkbox ${acceptedPolicy ? 'checked' : ''}`}
              onClick={() => setAcceptedPolicy(!acceptedPolicy)}
            >
              {acceptedPolicy && <span className="material-icons-round check-icon">check</span>}
            </div>
            <div className="checkbox-text-area">
              <span className="checkbox-label" onClick={() => setAcceptedPolicy(!acceptedPolicy)}>
                Acepto la <strong>Política de Privacidad</strong>
              </span>
              <a href="#" className="policy-link">Ver Política</a>
            </div>
          </div>
          
          {/* Submit Button Inside Form */}
          <button 
            type="submit" 
            className={`registro-submit-button ${!isFormValid || isLoading ? 'disabled' : ''}`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Comprobando ID...' : 'Continuar'}
          </button>
          
          {errorMessage && (
            <p className="error-message" style={{color: '#ff6b6b', marginTop: '10px', textAlign: 'center', fontSize: '14px', fontWeight: '500'}}>
              {errorMessage}
            </p>
          )}
        </form>
      </div>

      {/* Bottom Code */}
      <div className="bottom-code-indicator" style={{bottom: '30px'}}>
        7356-MX-2600009
      </div>
    </div>
  );
}

export default Registro;
