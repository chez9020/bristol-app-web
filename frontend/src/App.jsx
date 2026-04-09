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
      } catch(e) { }
    }
    return { screen: 'splash', agente: null };
  };

  const initialSession = checkSession();
  
  const [activeTab, setActiveTab] = useState('Inicio');
  const [currentScreen, setCurrentScreen] = useState(initialSession.screen);
  const [agente, setAgente] = useState(initialSession.agente);
  
  const [selectedConferencia, setSelectedConferencia] = useState(null);
  const [selectedPonente, setSelectedPonente] = useState(null);

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
            onUpdateAgente={setAgente}
          />
        )}
        {activeTab === 'Constancia' && <Constancia onBack={() => setActiveTab('Inicio')} agente={agente} />}
        {activeTab === 'Interacciones' && <Votaciones onBack={() => setActiveTab('Inicio')} agente={agente} />}
        {activeTab === 'Logistica' && <Logistica onBack={() => setActiveTab('Inicio')} />}
      </div>

      <div className="modern-legal-footer">
        3500-MX-2600044
      </div>

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
