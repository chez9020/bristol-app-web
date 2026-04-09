import React, { useState, useRef } from 'react';
import './Perfil.css';

function Perfil({ onBack, agente, onLogout, onUpdateAgente }) {
  const nameParts = (agente?.nombre || 'Agente IO').split(' ');
  const [nombre, setNombre] = useState(nameParts[0] || '');
  const [apellido, setApellido] = useState(nameParts.slice(1).join(' ') || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [currentFoto, setCurrentFoto] = useState(agente?.foto_url || null);

  const handleUpdate = async () => {
    if (!agente?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/agente/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_unico: agente.id,
          nombre: nombre,
          apellido: apellido
        })
      });
      const data = await response.json();
      if (response.ok && data.success && onUpdateAgente) {
        onUpdateAgente({ ...agente, nombre: data.nombre });
      }
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFoto = async (event) => {
    const file = event.target.files[0];
    if (!file || !agente?.id) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('id_unico', agente.id);
    formData.append('file', file);
    try {
      const response = await fetch('/api/agente/foto', { method: 'POST', body: formData });
      const data = await response.json();
      if (response.ok && data.success) {
        setCurrentFoto(data.foto_url);
        if (onUpdateAgente) onUpdateAgente({ ...agente, foto_url: data.foto_url });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const avatarUrl = currentFoto || `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=3e2c20&color=008fb4&size=256&bold=true`;

  return (
    <div className="perfil-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Perfil</h1>
          <div className="agenda-location">
            <span className="material-icons-round card-icon-gradient" style={{ fontSize: '18px', verticalAlign: 'middle' }}>event</span>
            <span>CAMZYOS® • Cancún</span>
          </div>
        </div>
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{color: 'white'}}>chevron_left</span>
        </div>
      </header>

      <div className="perfil-picture-section">
        <div className="perfil-picture-wrapper">
          <img src={avatarUrl} alt="Profile" className="perfil-picture" />
          <div className="perfil-edit-badge" onClick={() => fileInputRef.current.click()}>
            <span className="material-icons-round edit-icon">edit</span>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadFoto} />
          </div>
        </div>
      </div>

      <div className="perfil-form-section">
        <div className="perfil-input-group">
          <label className="perfil-input-label">NOMBRE</label>
          <div className="perfil-glass-input">
            <input 
              type="text" 
              className="perfil-input-field" 
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <span className="material-icons-round perfil-field-icon">edit</span>
          </div>
        </div>

        <div className="perfil-input-group">
          <label className="perfil-input-label">APELLIDO</label>
          <div className="perfil-glass-input">
            <input 
              type="text" 
              className="perfil-input-field" 
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            <span className="material-icons-round perfil-field-icon">edit</span>
          </div>
        </div>

        <button 
          className="btn-premium-gradient-qa" 
          onClick={handleUpdate}
          disabled={isLoading}
          style={{ marginTop: '10px' }}
        >
          <span className="material-icons-round">save</span>
          <span>{isLoading ? 'Guardando...' : 'Guardar cambios'}</span>
        </button>
      </div>

      <div className="perfil-actions">
        <button className="btn-logout" onClick={onLogout}>
          Cerrar sesión
        </button>
        <div className="perfil-footer-id">
          ID DE MISIÓN: {agente?.id}
        </div>
      </div>

    </div>
  );
}

export default Perfil;
