import { useState, useEffect } from 'react';
import './App.css';
import Inicio from './Inicio.jsx';
import Registro from './Registro.jsx';
import Agenda from './Agenda.jsx';
import Apuntes from './Apuntes.jsx';
import Perfil from './Perfil.jsx';
import Conferencias from './Conferencias.jsx';
import DetalleConferencias from './DetalleConferencias.jsx';
import BiografiaSpeaker from './BiografiaSpeaker.jsx';
import Constancia from './Constancia.jsx';
import Interacciones from './Interacciones.jsx';
import Logistica from './Logistica.jsx';

// NavItem and GridCard
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <div className={`modern-nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="material-icons-round nav-icon-modern">{icon}</span>
      <span className="nav-label-modern">{label}</span>
    </div>
  );
}

function GridCard({ icon, title, subtitle, onClick }) {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="card-icon-container">
        <span className="material-icons-round card-icon-gradient">{icon}</span>
      </div>
      <div className="card-info">
        <h3 className="card-title-main">{title}</h3>
        <p className="card-subtitle-secondary">{subtitle}</p>
      </div>
    </div>
  );
}

function App() {
  const checkSession = () => {
    const saved = localStorage.getItem('agenteSession');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (new Date().getTime() - data.timestamp < 21600000) {
          return { screen: 'app', agente: data.agente };
        } else {
          localStorage.removeItem('agenteSession');
        }
      } catch (e) { }
    }
    return { screen: 'splash', agente: null };
  };

  const initialSession = checkSession();

  const [activeTab, setActiveTab] = useState('Inicio');
  const [currentScreen, setCurrentScreen] = useState(initialSession.screen);
  const [agente, setAgente] = useState(initialSession.agente);

  const [selectedConferencia, setSelectedConferencia] = useState(null);
  const [selectedPonente, setSelectedPonente] = useState(null);
  const [showLockedModal, setShowLockedModal] = useState(false);

  // Cancún usa EST (UTC-5) permanente, sin cambio de horario
  const CONSTANCIA_UNLOCK = new Date('2026-04-17T11:00:00-05:00');
  const constanciaAvailable = new Date() >= CONSTANCIA_UNLOCK;

  const handleUpdateAgente = (newAgenteData) => {
    setAgente(newAgenteData);
    // Persist to localStorage so it survives refreshes
    const sessionData = {
      agente: newAgenteData,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('agenteSession', JSON.stringify(sessionData));
  };

  if (currentScreen === 'splash') {
    return <Inicio onEnterMission={() => setCurrentScreen('registro')} />;
  }

  if (currentScreen === 'registro') {
    return <Registro onRegister={(agenteData) => {
      setAgente(agenteData);
      setCurrentScreen('app');
    }} />;
  }

  return (
    <div className="app-container">
      <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>

        {activeTab === 'Inicio' && (
          <div className="tab-content animate-fade-in">
            <header className="dashboard-header">
              <h1>CAMZYOS<span>®</span> 2026</h1>
              <p>Cambiando paradigmas</p>
            </header>

            <div className="welcome-status-bar">
              <div className="status-dot-lilac"></div>
              <span>Hola, {agente?.nombre || 'Bienvenido'}</span>
            </div>

            <main className="dashboard-grid">
              <GridCard
                icon="calendar_today"
                title="Agenda"
                subtitle="CRONOGRAMA"
                onClick={() => setActiveTab('Agenda')}
              />
              <GridCard
                icon="podcasts"
                title="Conferencias"
                subtitle="EN VIVO"
                onClick={() => setActiveTab('Conferencias')}
              />
              <GridCard
                icon="forum"
                title="Interacción"
                subtitle="PREGUNTAS"
                onClick={() => setActiveTab('Interacciones')}
              />
              <GridCard
                icon="map"
                title="Logística"
                subtitle="UBICACIÓN"
                onClick={() => setActiveTab('Logistica')}
              />
              <GridCard
                icon={constanciaAvailable ? 'verified' : 'lock_clock'}
                title="Constancia"
                subtitle={constanciaAvailable ? 'CERTIFICADO' : '17 ABR · 11:00 AM'}
                onClick={() => constanciaAvailable
                  ? setActiveTab('Constancia')
                  : setShowLockedModal(true)}
              />
              <GridCard
                icon="edit_note"
                title="Apuntes"
                subtitle="NOTAS"
                onClick={() => setActiveTab('Apuntes')}
              />
            </main>
          </div>
        )}

        {/* Existing Tab Components (Keeping logic intact) */}
        {activeTab === 'Agenda' && <Agenda onBack={() => setActiveTab('Inicio')} />}
        {activeTab === 'Conferencias' && (
          <Conferencias
            onBack={() => setActiveTab('Inicio')}
            onDetalle={(conf) => {
              setSelectedConferencia(conf);
              setActiveTab('Detalle');
            }}
          />
        )}
        {activeTab === 'Detalle' && (
          <DetalleConferencias
            conferencia={selectedConferencia}
            onBack={() => setActiveTab('Conferencias')}
            onBiografia={(ponente) => {
              setSelectedPonente(ponente);
              setActiveTab('Biografia');
            }}
          />
        )}
        {activeTab === 'Biografia' && (
          <BiografiaSpeaker
            ponente={selectedPonente}
            onBack={() => setActiveTab('Detalle')}
          />
        )}
        {activeTab === 'Apuntes' && <Apuntes onBack={() => setActiveTab('Inicio')} agente={agente} />}
        {activeTab === 'Perfil' && (
          <Perfil
            onBack={() => setActiveTab('Inicio')}
            agente={agente}
            onLogout={() => {
              localStorage.removeItem('agenteSession');
              setAgente(null);
              setCurrentScreen('splash');
              setActiveTab('Inicio');
            }}
            onUpdateAgente={handleUpdateAgente}
          />
        )}
        {activeTab === 'Constancia' && (
          constanciaAvailable
            ? <Constancia onBack={() => setActiveTab('Inicio')} agente={agente} />
            : <div className="constancia-locked animate-fade-in">
                <header className="agenda-header">
                  <div className="agenda-header-text"><h1>Constancia</h1></div>
                  <div className="back-btn-circle" onClick={() => setActiveTab('Inicio')}>
                    <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
                  </div>
                </header>
                <div className="locked-body">
                  <span className="material-icons-round locked-icon">lock_clock</span>
                  <h2>Próximamente</h2>
                  <p>Tu constancia estará disponible a partir del</p>
                  <div className="locked-date">17 de Abril · 11:00 AM</div>
                  <p className="locked-sub">Cancún, México</p>
                </div>
              </div>
        )}
        {activeTab === 'Interacciones' && <Interacciones onBack={() => setActiveTab('Inicio')} agente={agente} />}
        {activeTab === 'Logistica' && <Logistica onBack={() => setActiveTab('Inicio')} />}
      </div>

      <div className="modern-legal-footer">
        {activeTab === 'Constancia' ? 'CV-MX-2600032' : '3500-MX-2600044'}
      </div>

      {/* Modal: Constancia bloqueada */}
      {showLockedModal && (
        <div className="modal-overlay" onClick={() => setShowLockedModal(false)}>
          <div className="modal-locked-card" onClick={e => e.stopPropagation()}>
            <span className="material-icons-round modal-lock-icon">lock_clock</span>
            <h3>Próximamente</h3>
            <p>Tu constancia estará disponible a partir del:</p>
            <div className="modal-locked-date">17 de Abril · 11:00 AM</div>
            <p className="modal-locked-tz">Hora Cancún, México (EST)</p>
            <button className="modal-close-btn" onClick={() => setShowLockedModal(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}

      <nav className="modern-bottom-nav">
        <NavItem
          icon="home"
          label="Inicio"
          isActive={activeTab === 'Inicio'}
          onClick={() => setActiveTab('Inicio')}
        />
        <NavItem
          icon="event_note"
          label="Agenda"
          isActive={activeTab === 'Agenda'}
          onClick={() => setActiveTab('Agenda')}
        />
        <NavItem
          icon="forum"
          label="Interacciones"
          isActive={activeTab === 'Interacciones'}
          onClick={() => setActiveTab('Interacciones')}
        />
        <NavItem
          icon="person"
          label="Perfil"
          isActive={activeTab === 'Perfil'}
          onClick={() => setActiveTab('Perfil')}
        />
      </nav>
    </div>
  );
}

export default App;
