import { useState, useRef } from 'react';
import './Perfil.css';

function Perfil({ onBack, agente, onLogout, onUpdateAgente }) {
  // Split name for visual breakdown
  const nameParts = (agente?.nombre || 'Agente IO').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const [nombre, setNombre] = useState(firstName);
  const [apellido, setApellido] = useState(lastName);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Ref para abrir el input de archivo oculto
  const fileInputRef = useRef(null);
  
  // Guardamos un estado local de la foto por si cambia recién hoy
  const [currentFoto, setCurrentFoto] = useState(agente?.foto_url || null);
  
  const handleUpdate = async () => {
    if (!agente?.id) return;
    
    setIsLoading(true);
    setStatusMessage('Actualizando...');
    
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
      if (response.ok && data.success) {
        setStatusMessage('¡Perfil actualizado con éxito!');
        
        // Push the brand new name up to the top App container to sync the greeting
        if (onUpdateAgente) {
          onUpdateAgente({ ...agente, nombre: data.nombre });
        }
        
        // Hide success message smoothly after 3 seconds
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage('Error al actualizar');
      }
    } catch (error) {
      console.error("Error updating profile", error);
      setStatusMessage('Fallo en conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFoto = async (event) => {
    const file = event.target.files[0];
    if (!file || !agente?.id) return;
    
    setIsLoading(true);
    setStatusMessage('Subiendo foto nueva...');
    
    // Usamos FormData porque estamos subiendo un archivo (imagen)
    const formData = new FormData();
    formData.append('id_unico', agente.id);
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/agente/foto', {
        method: 'POST',
        // No enviamos Content-Type a mano; el navegador lo asignará a multipart/form-data automático
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatusMessage('¡Foto de perfil actualizada!');
        setCurrentFoto(data.foto_url); // Refrescamos pantalla con nueva foto local
        
        // Sincronizamos con componente global (App)
        if (onUpdateAgente) {
          onUpdateAgente({ ...agente, foto_url: data.foto_url });
        }
        
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage('Error al actualizar foto');
      }
    } catch (e) {
      console.error(e);
      setStatusMessage('Fallo en conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // Genera un avatar dinámico profesional con las iniciales del agente si no hay foto real
  const avatarUrl = currentFoto || `https://ui-avatars.com/api/?name=${agente?.nombre || 'Agente IO'}&background=3e2c20&color=008fb4&size=256&bold=true`;

  return (
    <div className="perfil-container animate-fade-in">
      {/* Header Info */}
      <div className="perfil-header-area">
        <div className="perfil-header-text">
          <h1>Perfil</h1>
          <div className="perfil-header-subtitle">
            <span className="material-icons-round">event</span>
            <span>IO SUMMIT 2026 • Playa del Carmen</span>
          </div>
        </div>
        <div className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="perfil-picture-section">
        <div className="perfil-picture-wrapper">
          <img src={avatarUrl} alt="Profile" className="perfil-picture" />
          <div className="perfil-edit-badge" onClick={() => fileInputRef.current.click()}>
            <span className="material-icons-round edit-icon">edit</span>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleUploadFoto} 
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="perfil-form-section">
        <div className="floating-input-group">
          <label className="floating-label">Nombre</label>
          <input 
            type="text" 
            className="floating-input" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="floating-input-group">
          <label className="floating-label">Apellido</label>
          <input 
            type="text" 
            className="floating-input" 
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        
        {statusMessage && (
          <p style={{ color: statusMessage.includes('Error') || statusMessage.includes('Fallo') ? '#ff6b6b' : '#008fb4', textAlign: 'center', fontSize: '14px', margin: '0' }}>
            {statusMessage}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="perfil-actions">
        <button 
          className="update-button" 
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </button>
        <button className="logout-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Perfil;
