import { useState } from 'react';
import './App.css';
import Inicio from './Inicio.jsx';
import Registro from './Registro.jsx';
import Agenda from './Agenda.jsx';
import MiAgenda from './MiAgenda.jsx';
import Apuntes from './Apuntes.jsx';
import Perfil from './Perfil.jsx';
import Conferencias from './Conferencias.jsx';
import BiografiaSpeaker from './BiografiaSpeaker.jsx';
import Ponentes from './Ponentes.jsx';
import Constancia from './Constancia.jsx';
import Interacciones from './Interacciones.jsx';
import Logistica from './Logistica.jsx';
import Biblioteca from './Biblioteca.jsx';
import Encuestas from './Encuestas.jsx';
import EncuestaEntrada from './EncuestaEntrada.jsx';
import DigitalPass from './DigitalPass.jsx';
import Panel from './Panel.jsx';
import PanelDisplay from './PanelDisplay.jsx';
import PanelAdmin from './PanelAdmin.jsx';
import { isEncuestaCompletada } from './encuestaSalida';
import { isEncuestaEntradaCompletada } from './encuestaEntrada';
import EncuestasHub from './EncuestasHub.jsx';
import EncuestaResultados from './EncuestaResultados.jsx';

// NavItem and GridCard
function NavItem({ icon, iconSrc, label, isActive, onClick }) {
  return (
    <div className={`modern-nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      {iconSrc
        ? <img src={iconSrc} alt="" className="nav-icon-img" />
        : <span className="material-icons-round nav-icon-modern">{icon}</span>}
      <span className="nav-label-modern">{label}</span>
    </div>
  );
}

function GridCard({ icon, iconSrc, title, subtitle, onClick, disabled }) {
  return (
    <div className={`dashboard-card${disabled ? ' is-disabled' : ''}`} onClick={onClick}>
      <div className="card-icon-container">
        {iconSrc
          ? <img src={iconSrc} alt="" className="card-icon-img" />
          : <span className="material-icons-round card-icon-gradient">{icon}</span>}
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
      } catch { /* sesión corrupta, ir a splash */ }
    }
    return { screen: 'splash', agente: null };
  };

  const initialSession = checkSession();

  const [activeTab, setActiveTab] = useState('Inicio');
  const [currentScreen, setCurrentScreen] = useState(initialSession.screen);
  const [agente, setAgente] = useState(initialSession.agente);

  const [selectedPonente, setSelectedPonente] = useState(null);
  const [biografiaOrigin, setBiografiaOrigin] = useState('Ponentes');
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showEncuestaRequiredModal, setShowEncuestaRequiredModal] = useState(false);
  const [comingSoonLabel, setComingSoonLabel] = useState(null);

  // Cancún usa EST (UTC-5) permanente, sin cambio de horario
  const CONSTANCIA_UNLOCK = new Date('2026-08-29T17:00:00-05:00');
  const dateUnlocked = new Date() >= CONSTANCIA_UNLOCK;
  // La constancia exige las dos encuestas, entrada y salida.
  const salidaCompletada = isEncuestaCompletada(agente?.id);
  const entradaCompletada = isEncuestaEntradaCompletada(agente?.id);
  const encuestasCompletadas = (entradaCompletada ? 1 : 0) + (salidaCompletada ? 1 : 0);
  const encuestaCompletada = encuestasCompletadas === 2;
  const constanciaAvailable = dateUnlocked && encuestaCompletada;

  const ENCUESTA_SALIDA_UNLOCK = new Date('2026-08-29T00:00:00-05:00');
  const salidaActiva = new Date() >= ENCUESTA_SALIDA_UNLOCK;

  const handleUpdateAgente = (newAgenteData) => {
    setAgente(newAgenteData);
    // Persist to localStorage so it survives refreshes
    const sessionData = {
      agente: newAgenteData,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('agenteSession', JSON.stringify(sessionData));
  };

  if (window.location.pathname === '/panel-display') {
    return <PanelDisplay />;
  }

  if (window.location.pathname === '/panel-admin') {
    if (agente?.tipo === 'Developer') {
      return <PanelAdmin />;
    }
    if (agente) {
      return <div style={{ padding: 40, fontFamily: 'var(--font-inter)' }}>Acceso restringido.</div>;
    }
    return <Registro onRegister={handleUpdateAgente} />;
  }

  if (window.location.pathname === '/encuesta-resultados') {
    if (agente?.tipo === 'Developer') {
      return <EncuestaResultados />;
    }
    if (agente) {
      return <div style={{ padding: 40, fontFamily: 'var(--font-inter)' }}>Acceso restringido.</div>;
    }
    return <Registro onRegister={handleUpdateAgente} />;
  }

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
              <div className="dashboard-header-text">
                <h1>BLOOD 2026</h1>
                <p>Innovation of Hematological Diseases</p>
              </div>
              <img src="/assets/icon_notification_bell.png" alt="" className="dashboard-header-bell" />
            </header>

            <div className="welcome-status-bar">
              <span>Bienvenido, {agente?.nombre || 'Agente'}</span>
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
                subtitle="PREGUNTAS Y RESPUESTAS"
                onClick={() => setActiveTab('Interacciones')}
              />
              <GridCard
                icon="poll"
                title="Panel"
                subtitle="ENCUESTA EN VIVO"
                onClick={() => setActiveTab('Panel')}
              />
              <GridCard
                icon="map"
                title="Logística"
                subtitle="HOTEL, SEDE Y RESTAURANTES"
                onClick={() => setActiveTab('Logistica')}
              />
              <GridCard
                icon={constanciaAvailable ? 'verified' : !dateUnlocked ? 'lock_clock' : 'assignment_late'}
                title="Constancia"
                subtitle={constanciaAvailable ? 'CERTIFICADO' : !dateUnlocked ? '29 AGO · 5:00 PM' : 'CONTESTA TUS ENCUESTAS'}
                disabled={!constanciaAvailable}
                onClick={() => {
                  if (constanciaAvailable) setActiveTab('Constancia');
                  else if (!dateUnlocked) setShowLockedModal(true);
                  else setShowEncuestaRequiredModal(true);
                }}
              />
              <GridCard
                iconSrc="/assets/icon_digital_pass.png"
                title="Digital Pass"
                subtitle="GAFETE"
                onClick={() => setActiveTab('DigitalPass')}
              />
              <GridCard
                iconSrc="/assets/icon_ponentes.png"
                title="Ponentes"
                subtitle="EXPERTOS"
                onClick={() => setActiveTab('Ponentes')}
              />
              <GridCard
                iconSrc="/assets/icon_mi_agenda.png"
                title="Mi agenda"
                subtitle="PERSONALIZADA"
                onClick={() => setActiveTab('MiAgenda')}
              />
              <GridCard
                iconSrc="/assets/icon_encuesta.png"
                title="Encuestas"
                subtitle={
                  encuestasCompletadas === 2 ? 'COMPLETADAS'
                    : encuestasCompletadas === 1 ? 'FALTA 1'
                      : 'PENDIENTES: 2'
                }
                onClick={() => setActiveTab('EncuestasHub')}
              />
              <GridCard
                icon="edit_note"
                title="Notas"
                subtitle="APUNTES"
                onClick={() => setActiveTab('Apuntes')}
              />
              <GridCard
                iconSrc="/assets/icon_bibliotecas.png"
                title="Bibliotecas"
                subtitle="PRESENTACIONES Y RECURSOS"
                onClick={() => setActiveTab('Biblioteca')}
              />
            </main>
          </div>
        )}

        {/* Existing Tab Components (Keeping logic intact) */}
        {activeTab === 'Agenda' && <Agenda onBack={() => setActiveTab('Inicio')} agente={agente} />}
        {activeTab === 'MiAgenda' && <MiAgenda onBack={() => setActiveTab('Inicio')} agente={agente} />}
        {activeTab === 'Conferencias' && (
          <Conferencias onBack={() => setActiveTab('Inicio')} />
        )}
        {activeTab === 'Ponentes' && (
          <Ponentes
            onBack={() => setActiveTab('Inicio')}
            onBiografia={(ponente) => {
              setSelectedPonente(ponente);
              setBiografiaOrigin('Ponentes');
              setActiveTab('Biografia');
            }}
          />
        )}
        {activeTab === 'Biografia' && (
          <BiografiaSpeaker
            ponente={selectedPonente}
            onBack={() => setActiveTab(biografiaOrigin)}
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
            ? <Constancia onBack={() => setActiveTab('Inicio')} onGoToEncuesta={() => setActiveTab('EncuestasHub')} agente={agente} />
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
        {activeTab === 'EncuestasHub' && (
          <EncuestasHub
            onBack={() => setActiveTab('Inicio')}
            onAbrirEntrada={() => setActiveTab('EncuestaEntrada')}
            onAbrirSalida={() => setActiveTab('Encuestas')}
            entradaHecha={entradaCompletada}
            salidaHecha={salidaCompletada}
            salidaActiva={salidaActiva}
          />
        )}

        {activeTab === 'Encuestas' && (
          <Encuestas
            onBack={() => setActiveTab('EncuestasHub')}
            agente={agente}
          />
        )}

        {activeTab === 'EncuestaEntrada' && (
          <EncuestaEntrada onBack={() => setActiveTab('EncuestasHub')} agente={agente} />
        )}
        {activeTab === 'DigitalPass' && (
          <DigitalPass onBack={() => setActiveTab('Inicio')} agente={agente} />
        )}
        {activeTab === 'Interacciones' && <Interacciones onBack={() => setActiveTab('Inicio')} agente={agente} />}
          {activeTab === 'Panel' && <Panel onBack={() => setActiveTab('Inicio')} agente={agente} />}
        {activeTab === 'Logistica' && <Logistica onBack={() => setActiveTab('Inicio')} />}
        {activeTab === 'Biblioteca' && <Biblioteca onBack={() => setActiveTab('Inicio')} />}
      </div>

      <div className="modern-legal-footer">
        {activeTab === 'Constancia' ? 'CV-MX-2600032' : 'HE-MX-2600018'}
      </div>

      {/* Modal: Constancia bloqueada */}
      {showLockedModal && (
        <div className="modal-overlay" onClick={() => setShowLockedModal(false)}>
          <div className="modal-locked-card" onClick={e => e.stopPropagation()}>
            <span className="material-icons-round modal-lock-icon">lock_clock</span>
            <h3>Próximamente</h3>
            <p>Tu constancia estará disponible a partir del:</p>
            <div className="modal-locked-date">29 de Agosto · 5:00 PM</div>
            <p className="modal-locked-tz">Hora Cancún, México (EST)</p>
            <button className="modal-close-btn" onClick={() => setShowLockedModal(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal: Constancia bloqueada por encuesta pendiente */}
      {showEncuestaRequiredModal && (
        <div className="modal-overlay" onClick={() => setShowEncuestaRequiredModal(false)}>
          <div className="modal-locked-card" onClick={e => e.stopPropagation()}>
            <span className="material-icons-round modal-lock-icon">assignment_late</span>
            <h3>{encuestasCompletadas === 1 ? 'Te falta una encuesta' : 'Encuestas pendientes'}</h3>
            <p>
              {encuestasCompletadas === 1
                ? `Contesta la encuesta de ${entradaCompletada ? 'salida' : 'entrada'} para desbloquear tu constancia.`
                : 'Contesta las encuestas de entrada y salida para desbloquear tu constancia.'}
            </p>
            <button
              className="modal-close-btn"
              onClick={() => { setShowEncuestaRequiredModal(false); setActiveTab('EncuestasHub'); }}
            >
              Ir a la encuesta
            </button>
          </div>
        </div>
      )}

      {/* Modal genérico: features aún no disponibles */}
      {comingSoonLabel && (
        <div className="modal-overlay" onClick={() => setComingSoonLabel(null)}>
          <div className="modal-locked-card" onClick={e => e.stopPropagation()}>
            <span className="material-icons-round modal-lock-icon">hourglass_top</span>
            <h3>Próximamente</h3>
            <p>{comingSoonLabel} estará disponible muy pronto.</p>
            <button className="modal-close-btn" onClick={() => setComingSoonLabel(null)}>
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
          iconSrc="/assets/icon_nav_perfil.svg"
          label="Perfil"
          isActive={activeTab === 'Perfil'}
          onClick={() => setActiveTab('Perfil')}
        />
      </nav>
    </div>
  );
}

export default App;
