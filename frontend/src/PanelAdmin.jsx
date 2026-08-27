import { useState, useEffect } from 'react';
import './Agenda.css';
import './PanelAdmin.css';
import { conferenciasData } from './conferenciasData';
import { useLiveConfigs, savePollConfig } from './pollService';

function PanelAdmin() {
  const configs = useLiveConfigs();
  const [confId, setConfId] = useState(conferenciasData[0]?.id ?? null);
  const [preguntas, setPreguntas] = useState([]);

  // Solo resincroniza al cambiar de sesión, no en cada push de Firestore (evita pisar ediciones en curso)
  useEffect(() => {
    setPreguntas(configs[confId] || configs[String(confId)] || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confId]);

  const conf = conferenciasData.find(c => c.id === confId);

  const addPregunta = () => {
    const id = `p${confId}_${Date.now()}`;
    setPreguntas([...preguntas, { id, texto: '', tipo: 'unica', opciones: [{ id: `${id}_a`, texto: '' }, { id: `${id}_b`, texto: '' }] }]);
  };

  const removePregunta = (id) => setPreguntas(preguntas.filter(p => p.id !== id));

  const updateTexto = (id, texto) => setPreguntas(preguntas.map(p => (p.id === id ? { ...p, texto } : p)));

  const updateTipo = (id, tipo) => setPreguntas(preguntas.map(p => (p.id === id ? { ...p, tipo } : p)));

  const addOpcion = (pid) => setPreguntas(preguntas.map(p => (p.id === pid
    ? { ...p, opciones: [...p.opciones, { id: `${pid}_${p.opciones.length}_${Date.now()}`, texto: '' }] }
    : p)));

  const removeOpcion = (pid, oid) => setPreguntas(preguntas.map(p => (p.id === pid
    ? { ...p, opciones: p.opciones.filter(o => o.id !== oid) }
    : p)));

  const updateOpcion = (pid, oid, texto) => setPreguntas(preguntas.map(p => (p.id === pid
    ? { ...p, opciones: p.opciones.map(o => (o.id === oid ? { ...o, texto } : o)) }
    : p)));

  const updateOpcionLibre = (pid, oid, libre) => setPreguntas(preguntas.map(p => (p.id === pid
    ? { ...p, opciones: p.opciones.map(o => (o.id === oid ? { ...o, libre } : o)) }
    : p)));

  const NEEDS_OPCIONES = ['unica', 'multiple', 'ranking'];

  const save = async () => {
    const clean = preguntas.filter(p => {
      if (!p.texto.trim()) return false;
      if (!NEEDS_OPCIONES.includes(p.tipo || 'unica')) return true;
      return p.opciones.filter(o => o.texto.trim()).length >= 2;
    });
    await savePollConfig(confId, clean);
    alert('Guardado');
  };

  return (
    <div className="pnladm-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Panel admin</h1>
          <div className="agenda-subtitle">
            <span className="material-icons-round">event</span>
            <span>BLOOD 2026</span>
          </div>
        </div>
        <img src="/assets/icon_notification_bell.png" alt="" className="agenda-header-bell" />
      </header>

      <div className="pnladm-body">
        <label className="pnladm-label">Sesión</label>
        <select className="pnladm-select" value={confId ?? ''} onChange={(e) => setConfId(Number(e.target.value))}>
          {conferenciasData.map(c => (
            <option key={c.id} value={c.id}>
              {c.titulo} {configs[c.id] ? '● tiene preguntas' : ''}
            </option>
          ))}
        </select>

        {preguntas.map((p, pi) => (
          <div key={p.id} className="pnladm-pregunta">
            <div className="pnladm-pregunta-head">
              <span>Pregunta {pi + 1}</span>
              <button className="pnladm-remove" onClick={() => removePregunta(p.id)}>Eliminar</button>
            </div>
            <input
              className="pnladm-input"
              placeholder="Texto de la pregunta"
              value={p.texto}
              onChange={(e) => updateTexto(p.id, e.target.value)}
            />
            <select
              className="pnladm-select pnladm-select-tipo"
              value={p.tipo || 'unica'}
              onChange={(e) => updateTipo(p.id, e.target.value)}
            >
              <option value="unica">Opción única</option>
              <option value="multiple">Selección múltiple</option>
              <option value="porcentaje">Porcentaje</option>
              <option value="abierta">Respuesta abierta</option>
              <option value="ranking">Ranking</option>
            </select>
            {NEEDS_OPCIONES.includes(p.tipo || 'unica') && (
              <>
                {p.opciones.map((o, oi) => (
                  <div key={o.id} className="pnladm-opcion-row">
                    <input
                      className="pnladm-input pnladm-input-opcion"
                      placeholder={`Opción ${oi + 1}`}
                      value={o.texto}
                      onChange={(e) => updateOpcion(p.id, o.id, e.target.value)}
                    />
                    {p.tipo === 'multiple' && (
                      <label className="pnladm-opcion-libre">
                        <input
                          type="checkbox"
                          checked={!!o.libre}
                          onChange={(e) => updateOpcionLibre(p.id, o.id, e.target.checked)}
                        />
                        Otra (texto libre)
                      </label>
                    )}
                    {p.opciones.length > 2 && (
                      <button className="pnladm-remove-small" onClick={() => removeOpcion(p.id, o.id)}>✕</button>
                    )}
                  </div>
                ))}
                <button className="pnladm-add-opcion" onClick={() => addOpcion(p.id)}>+ Opción</button>
              </>
            )}
          </div>
        ))}

        <button className="pnladm-add-pregunta" onClick={addPregunta}>+ Pregunta</button>
        <button className="pnladm-save" onClick={save}>Guardar sesión: {conf?.titulo}</button>
      </div>
    </div>
  );
}

export default PanelAdmin;
