import { useState } from 'react';
import { conferenciasData } from './conferenciasData';
import { useLiveDB, useLiveConfigs } from './pollService';
import './EncuestaResultados.css';

function Barras({ filas, total }) {
  if (!filas.length || filas.every((f) => f.n === 0)) {
    return <p className="eres-vacio">Sin respuestas.</p>;
  }
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
              {f.n}{total ? ` · ${Math.round((f.n / total) * 100)}%` : ''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ResultadoPregunta({ pregunta, respuestas, otros }) {
  const tipo = pregunta.tipo || 'unica';
  const valores = Object.values(respuestas);
  const textosOtros = Object.values(otros).filter((t) => t && String(t).trim());

  // Los contadores agregados (campo `options`) no son confiables: varias
  // conferencias comparten ids de pregunta (p1..p5) y sus votos se suman en el
  // mismo documento. Recontamos desde `users`, aceptando sólo respuestas cuya
  // forma y opciones correspondan a ESTA pregunta.
  const validas = new Set((pregunta.opciones || []).map((o) => o.id));
  const conteo = {};
  let participantes = 0;

  valores.forEach((valor) => {
    const esLista = Array.isArray(valor);
    if (tipo === 'ranking' || tipo === 'multiple') {
      if (!esLista) return;
      const propias = valor.filter((id) => validas.has(id));
      if (!propias.length) return;
      participantes += 1;
      // Contamos personas, no puntos: cada quien suma 1 por opción elegida.
      propias.forEach((id) => { conteo[id] = (conteo[id] || 0) + 1; });
    } else if (tipo === 'unica') {
      if (esLista || !validas.has(valor)) return;
      participantes += 1;
      conteo[valor] = (conteo[valor] || 0) + 1;
    } else {
      participantes += 1;
    }
  });

  const filas = (pregunta.opciones || []).map((op) => ({
    id: op.id,
    texto: op.texto,
    n: conteo[op.id] || 0,
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
  } else {
    // unica, multiple y ranking: personas por opción. En unica la suma de las
    // filas es el total; en multiple/ranking cada persona elige varias.
    const ordenadas = filas.slice().sort((a, b) => b.n - a.n);
    cuerpo = (
      <>
        {tipo !== 'unica' && (
          <p className="eres-hint">
            Cada persona eligió varias opciones: los porcentajes son sobre {participantes} participante{participantes === 1 ? '' : 's'} y suman más de 100%.
          </p>
        )}
        <Barras filas={ordenadas} total={participantes} />
      </>
    );
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
