import React, { useState, useRef } from 'react';
import './Agenda.css';
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

  const avatarUrl = currentFoto || `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=4f0180&color=ffffff&size=256&bold=true`;

  return (
    <div className="perfil-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Perfil</h1>
          <div className="agenda-subtitle">
            <span className="material-icons-round">event</span>
            <span>BLOOD 2026</span>
          </div>
        </div>
        <img src="/assets/icon_notification_bell.png" alt="" className="agenda-header-bell" />
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
        </div>
      </header>

      <div className="perfil-picture-section">
        <div className="perfil-picture-wrapper">
          <img src={avatarUrl} alt="Perfil" className="perfil-picture" />
          <div className="perfil-edit-badge" onClick={() => fileInputRef.current.click()}>
            <span className="material-icons-round">{isLoading ? 'hourglass_top' : 'edit'}</span>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadFoto} />
          </div>
        </div>
      </div>

      <div className="perfil-form-section">
        <input
          type="text"
          className="perfil-input-field"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={handleUpdate}
        />
        <input
          type="text"
          className="perfil-input-field"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          onBlur={handleUpdate}
        />
      </div>

      <div className="perfil-actions">
        <button className="perfil-logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Perfil;
