import { useState } from 'react';
import { conferenciasData } from './conferenciasData';
import { useLiveDB, useLiveConfigs } from './pollService';
import './EncuestaResultados.css';

function Barras({ filas, total, sufijo }) {
  if (!filas.length) return <p className="eres-vacio">Sin respuestas.</p>;
  const tope = Math.max(...filas.map((f) => f.n), 1);
  return (
    <table className="eres-tabla">
      <tbody>
        {filas.map((f) => (
          <tr key={f.id}>
            <td>{f.texto}</td>
            <td className="eres-barra-celda">
              <div className="eres-barra">
                <div className="eres-barra-fill" style={{ width: `${(f.n / tope) * 100}%` }} />
              </div>
            </td>
            <td className="eres-num">
              {f.n}{sufijo || ''}{total ? ` · ${Math.round((f.n / total) * 100)}%` : ''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ResultadoPregunta({ pregunta, votos, respuestas, otros }) {
  const tipo = pregunta.tipo || 'unica';
  const participantes = Object.keys(respuestas).length;
  const valores = Object.values(respuestas);
  const textosOtros = Object.values(otros).filter((t) => t && String(t).trim());

  const filas = (pregunta.opciones || []).map((op) => ({
    id: op.id,
    texto: op.texto,
    n: votos[op.id] || 0,
  }));

  let cuerpo;

  if (tipo === 'porcentaje') {
    const nums = valores.map(Number).filter((n) => !Number.isNaN(n));
    const promedio = nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
    cuerpo = nums.length ? (
      <p className="eres-total">
        Promedio <strong>{promedio}%</strong> · mín {Math.min(...nums)}% · máx {Math.max(...nums)}% · {nums.length} respuestas
      </p>
    ) : (
      <p className="eres-vacio">Sin respuestas.</p>
    );
  } else if (tipo === 'abierta') {
    cuerpo = valores.length ? (
      <ul className="eres-abiertas">
        {valores.map((t, i) => <li key={i}>{String(t)}</li>)}
      </ul>
    ) : (
      <p className="eres-vacio">Sin respuestas.</p>
    );
  } else if (tipo === 'ranking') {
    cuerpo = (
      <>
        <p className="eres-hint">Puntos acumulados (1er lugar = más puntos).</p>
        <Barras filas={filas.slice().sort((a, b) => b.n - a.n)} total={0} sufijo=" pts" />
      </>
    );
  } else {
    // unica y multiple
    const total = tipo === 'multiple' ? participantes : filas.reduce((a, f) => a + f.n, 0);
    cuerpo = <Barras filas={filas.slice().sort((a, b) => b.n - a.n)} total={total} />;
  }

  return (
    <div className="eres-card">
      <h3>{pregunta.texto}</h3>
      {cuerpo}
      {textosOtros.length > 0 && (
        <p className="eres-otros">
          <strong>Respuestas "Otro":</strong> {textosOtros.join(' · ')}
        </p>
      )}
      <p className="eres-hint" style={{ margin: '10px 0 0' }}>
        {participantes} participante{participantes === 1 ? '' : 's'}
      </p>
    </div>
  );
}

function PanelResultados() {
  const db = useLiveDB();
  const configs = useLiveConfigs();
  const [confSel, setConfSel] = useState(null);

  // Solo paneles que ya tienen al menos una respuesta registrada.
  const conIds = Object.keys(configs).filter((confId) =>
    configs[confId].some((p) => Object.keys(db.answers[p.id] || {}).length > 0)
  );

  const conferencias = conIds
    .map((confId) => ({
      confId,
      conf: conferenciasData.find((c) => c.id === Number(confId)),
      preguntas: configs[confId],
    }))
    .sort((a, b) => Number(a.confId) - Number(b.confId));

  const actual = conferencias.find((c) => c.confId === confSel) || conferencias[0];

  return (
    <div className="eres-page">
      <header className="eres-header">
        <h1>Resultados en vivo</h1>
        <p>Dinámicas de los paneles · BLOOD 2026</p>
      </header>

      <div className="eres-body">
        {conferencias.length === 0 ? (
          <p className="eres-vacio">Todavía no hay respuestas registradas en ninguna dinámica.</p>
        ) : (
          <>
            <div className="eres-tabs">
              {conferencias.map((c) => (
                <button
                  key={c.confId}
                  className={`eres-tab ${actual.confId === c.confId ? 'eres-tab-active' : ''}`}
                  onClick={() => setConfSel(c.confId)}
                >
                  {c.conf?.titulo || `Panel ${c.confId}`}
                </button>
              ))}
            </div>

            {actual.preguntas.map((p) => (
              <ResultadoPregunta
                key={p.id}
                pregunta={p}
                votos={db.votes[p.id] || {}}
                respuestas={db.answers[p.id] || {}}
                otros={db.otros[p.id] || {}}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default PanelResultados;
