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
import Votaciones from './Votaciones.jsx';
import Logistica from './Logistica.jsx';

// NavItem and GridCard
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <div className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="material-icons-round nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </div>
  );
}

function GridCard({ icon, title, subtitle, onClick }) {
  return (
    <div className="grid-card" onClick={onClick}>
      <div className="card-top-right-border"></div>
      <div className="card-bottom-left-border"></div>
      
      <div className="card-icon-wrapper">
        <span className="material-icons-round card-icon">{icon}</span>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-subtitle">{subtitle}</p>
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
        // Verificar si la sesión es menor a 6 horas (6h * 60m * 60s * 1000ms = 21600000ms)
        if (new Date().getTime() - data.timestamp < 21600000) {
          return { screen: 'app', agente: data.agente };
        } else {
          localStorage.removeItem('agenteSession');
        }
      } catch(e) { /* ignore parse error */ }
    }
    return { screen: 'splash', agente: null };
  };

  const initialSession = checkSession();
  
  const [activeTab, setActiveTab] = useState('Inicio');
  const [currentScreen, setCurrentScreen] = useState(initialSession.screen); // 'splash', 'registro', 'app'
  const [agente, setAgente] = useState(initialSession.agente);
  
  // Data State for deep navigation
  const [selectedConferencia, setSelectedConferencia] = useState(null);
  const [selectedPonente, setSelectedPonente] = useState(null);

  if (currentScreen === 'splash') {
    return <Inicio onEnterMission={() => setCurrentScreen('registro')} />;
  }

  if (currentScreen === 'registro') {
    return <Registro onRegister={(agenteData) => {
      console.log("Agente autenticado:", agenteData);
      setAgente(agenteData);
      setCurrentScreen('app');
    }} />;
  }

  // Generate dynamic avatar or use uploaded photo for the header display
  const headerAvatarUrl = agente?.foto_url || `https://ui-avatars.com/api/?name=${agente?.nombre || 'Agente IO'}&background=3e2c20&color=008fb4&size=128&bold=true`;

  return (
    <div className="app-container">
      {/* Dynamic Content Wrapper to push the bottom-code-indicator down */}
      <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* Content Area */}
        {activeTab === 'Inicio' && (
          <div className="tab-content animate-fade-in">
            {/* Header Info */}
            <header className="home-header">
              <div className="summit-title-container">
                <div className="security-icon-badge">
                  <img src={headerAvatarUrl} alt="Avatar" className="header-avatar-img" />
                </div>
                <div className="summit-title-text">
                  <h1>IO SUMMIT 2026</h1>
                  <p>Agente IO {agente?.nombre ? `- ${agente.nombre}` : ''}</p>
                </div>
              </div>
              <div className="mission-status-badge">
                <div className="status-dot-container">
                  <div className="status-dot-glow"></div>
                  <div className="status-dot"></div>
                </div>
                <p className="status-text">
                  <span>ESTADO DE LA MISIÓN: </span>
                  <span className="status-active">ACTIVA</span>
                </p>
              </div>
            </header>

            {/* Main Grid */}
            <main className="cards-grid">
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
                subtitle="NETWORKING" 
                onClick={() => setActiveTab('Interacciones')}
              />
              
              <GridCard 
                icon="map" 
                title="Logística" 
                subtitle="UBICACIÓN" 
                onClick={() => setActiveTab('Logistica')}
              />
              
              <GridCard 
                icon="verified" 
                title="Constancia" 
                subtitle="CERTIFICADO" 
                onClick={() => setActiveTab('Constancia')}
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

        {activeTab === 'Agenda' && (
          <Agenda onBack={() => setActiveTab('Inicio')} />
        )}

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

        {activeTab === 'Apuntes' && (
          <Apuntes onBack={() => setActiveTab('Inicio')} agente={agente} />
        )}

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
            onUpdateAgente={setAgente}
          />
        )}

        {activeTab === 'Constancia' && (
          <Constancia 
            onBack={() => setActiveTab('Inicio')} 
            agente={agente}
          />
        )}

        {activeTab === 'Interacciones' && (
          <Votaciones 
            onBack={() => setActiveTab('Inicio')} 
            agente={agente}
          />
        )}

        {activeTab === 'Logistica' && (
          <Logistica 
            onBack={() => setActiveTab('Inicio')} 
          />
        )}
      </div>

      {/* Bottom Code Indicator ALWAYS AFTER THE GROWING DIV */}
      {/* We stop hiding it for Detalle/Biografia because we want it shown on ALL SCREENS. It will flow naturally. */}
      <div className="bottom-code-indicator with-nav">
        7356-MX-2600009
      </div>



      {/* Navigation */}
      <nav className="bottom-nav">
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
