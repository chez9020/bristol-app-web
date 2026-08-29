import React, { useState, useEffect } from 'react';
import './EncuestaResultados.css';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { PREGUNTAS as PREGUNTAS_ENTRADA } from './encuestaEntradaPreguntas';

const RATING_LABELS = {
  q1: 'Relevancia científica',
  q2: 'Utilidad práctica clínica',
  q3: 'Calidad/claridad ponentes',
  q4: 'Profundidad de los temas',
  q6: 'Probabilidad iberdomida+dara+dexa (MMRR)',
  q7: 'Probabilidad mezigdomida+carfilzomib/bortezomib+dexa (MMRR)',
  q10: 'Experiencia general del evento',
};
const RATING_IDS = Object.keys(RATING_LABELS);

// La encuesta de salida no tiene un arreglo único de preguntas, así que aquí
// se declaran las columnas de su tabla.
const SALIDA_COLS = [
  ...RATING_IDS.map((id) => ({ id, label: RATING_LABELS[id] })),
  { id: 'q5', label: 'FDA / EMR (iberdomida)' },
  { id: 'q8', label: 'CELMoDs vs IMiDs' },
  { id: 'q9', label: 'Escenarios clínicos CELMoD' },
];

function avg(nums) {
  if (!nums.length) return 0;
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2);
}

function countBy(items) {
  const counts = {};
  items.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
  return counts;
}

function fechaCorta(f) {
  if (!f?.seconds) return '';
  return new Date(f.seconds * 1000).toLocaleString('es-MX', { timeZone: 'America/Cancun' });
}

// Las preguntas con opción "Otro: ______" guardan { valor, otro };
// las demás guardan el valor pelón.
function desempacar(resp) {
  if (resp && typeof resp === 'object' && !Array.isArray(resp) && 'valor' in resp) {
    return { valor: resp.valor, otro: resp.otro };
  }
  return { valor: resp, otro: null };
}

/** Convierte cualquier forma de respuesta en una celda legible. */
function textoCelda(resp) {
  const { valor, otro } = desempacar(resp);
  const sufijo = otro && otro.trim() ? ` — ${otro.trim()}` : '';
  if (valor === undefined || valor === null || valor === '') return sufijo ? sufijo.slice(3) : '—';
  if (Array.isArray(valor)) return valor.join(' · ') + sufijo;
  if (typeof valor === 'object') {
    return (valor.opcion || '') + (valor.sub ? ` (${valor.sub})` : '') + sufijo;
  }
  return String(valor) + sufijo;
}

function Barras({ counts, total }) {
  const filas = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!filas.length) return <p className="eres-vacio">Sin respuestas.</p>;
  const tope = Math.max(...filas.map(([, n]) => n));
  return (
    <table className="eres-tabla">
      <tbody>
        {filas.map(([op, n]) => (
          <tr key={op}>
            <td>{op}</td>
            <td className="eres-barra-celda">
              <div className="eres-barra">
                <div className="eres-barra-fill" style={{ width: `${(n / tope) * 100}%` }} />
              </div>
            </td>
            <td className="eres-num">{n}{total ? ` · ${Math.round((n / total) * 100)}%` : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ResultadoPregunta({ pregunta, rows }) {
  const crudas = rows.map((r) => desempacar(r.respuestas?.[pregunta.id]));
  const valores = crudas.map((c) => c.valor).filter((v) => v !== undefined && v !== null && v !== '');
  const otros = crudas.map((c) => c.otro).filter((o) => o && o.trim());

  let cuerpo;
  switch (pregunta.tipo) {
    case 'abierta_numero': {
      const nums = valores.map(Number).filter((n) => !Number.isNaN(n));
      cuerpo = nums.length
        ? (
          <table className="eres-tabla">
            <tbody>
              <tr><td>Promedio</td><td className="eres-num">{avg(nums)}</td></tr>
              <tr><td>Mínimo</td><td className="eres-num">{Math.min(...nums)}</td></tr>
              <tr><td>Máximo</td><td className="eres-num">{Math.max(...nums)}</td></tr>
              <tr><td>Respuestas</td><td className="eres-num">{nums.length}</td></tr>
            </tbody>
          </table>
        )
        : <p className="eres-vacio">Sin respuestas.</p>;
      break;
    }
    case 'unica_anidada': {
      const principales = countBy(valores.map((v) => v?.opcion).filter(Boolean));
      const subs = countBy(valores.map((v) => v?.sub).filter(Boolean));
      cuerpo = (
        <>
          <Barras counts={principales} total={valores.length} />
          {Object.keys(subs).length > 0 && (
            <>
              <p className="eres-hint" style={{ marginTop: 12 }}>Institución pública, desglose:</p>
              <Barras counts={subs} total={null} />
            </>
          )}
        </>
      );
      break;
    }
    case 'multiple':
      cuerpo = <Barras counts={countBy(valores.flat())} total={valores.length} />;
      break;
    case 'ranking': {
      // Cada respuesta es un arreglo ordenado: posición 0 = primer lugar.
      const puntos = {};
      const apariciones = {};
      valores.forEach((orden) => {
        (orden || []).forEach((op, i) => {
          puntos[op] = (puntos[op] || 0) + (pregunta.rankCount - i);
          apariciones[op] = (apariciones[op] || 0) + 1;
        });
      });
      const filas = Object.entries(puntos).sort((a, b) => b[1] - a[1]);
      cuerpo = filas.length
        ? (
          <table className="eres-tabla">
            <thead>
              <tr><th>Opción</th><th className="eres-num">Puntos</th><th className="eres-num">Veces elegida</th></tr>
            </thead>
            <tbody>
              {filas.map(([op, pts]) => (
                <tr key={op}>
                  <td>{op}</td>
                  <td className="eres-num">{pts}</td>
                  <td className="eres-num">{apariciones[op]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
        : <p className="eres-vacio">Sin respuestas.</p>;
      break;
    }
    default:
      cuerpo = <Barras counts={countBy(valores)} total={valores.length} />;
  }

  return (
    <div className="eres-card">
      <h3>{pregunta.texto}</h3>
      {cuerpo}
      {otros.length > 0 && (
        <p className="eres-otros"><strong>Otro:</strong> {otros.join(' · ')}</p>
      )}
    </div>
  );
}

/** Una fila por participante, una columna por pregunta. */
function TablaRespuestas({ rows, columnas, extra }) {
  if (!rows.length) return <p className="eres-vacio">Todavía no hay respuestas.</p>;
  return (
    <>
      <p className="eres-hint">
        Desliza horizontalmente para ver todas las preguntas. La columna del nombre queda fija.
      </p>
      <div className="eres-scroll">
        <table className="eres-tabla-ancha">
          <thead>
            <tr>
              <th className="eres-col-fija">Participante</th>
              <th>Fecha</th>
              {columnas.map((c) => <th key={c.id}>{c.label}</th>)}
              {extra && <th>{extra.label}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="eres-col-fija">
                  {r.nombre || '(sin nombre)'}
                  <div style={{ fontWeight: 400, fontSize: 11, color: '#7f7383' }}>{r.agente_id}</div>
                </td>
                <td>{fechaCorta(r.fecha)}</td>
                {columnas.map((c) => (
                  <td key={c.id} className="eres-celda-texto">{textoCelda(r.respuestas?.[c.id])}</td>
                ))}
                {extra && <td className="eres-celda-texto">{r[extra.campo] || '—'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// Solo la primera pregunta de cada sección lleva encabezado.
const ENTRADA_CON_SECCION = PREGUNTAS_ENTRADA.map((p, i, arr) => ({
  pregunta: p,
  encabezado: p.seccion && p.seccion !== arr.slice(0, i).findLast((q) => q.seccion)?.seccion
    ? p.seccion
    : null,
}));

const ENTRADA_COLS = PREGUNTAS_ENTRADA.map((p) => ({ id: p.id, label: p.texto }));

function ResumenEntrada({ rows }) {
  return (
    <>
      {ENTRADA_CON_SECCION.map(({ pregunta, encabezado }) => (
        <React.Fragment key={pregunta.id}>
          {encabezado && <h2 className="eres-seccion">{encabezado}</h2>}
          <ResultadoPregunta pregunta={pregunta} rows={rows} />
        </React.Fragment>
      ))}
    </>
  );
}

function ResumenSalida({ rows }) {
  const q5Counts = countBy(rows.map((r) => r.respuestas?.q5?.opcion).filter(Boolean));
  const q8Counts = countBy(rows.map((r) => r.respuestas?.q8?.valor).filter(Boolean));
  const q9Counts = countBy(rows.flatMap((r) => r.respuestas?.q9 || []));
  const comentarios = rows.map((r) => r.comentario_abierto).filter((c) => c && c.trim());

  return (
    <>
      <div className="eres-card">
        <h3>Promedios (escala 1-5)</h3>
        <table className="eres-tabla">
          <tbody>
            {RATING_IDS.map((id) => {
              const nums = rows.map((r) => r.respuestas?.[id]).filter((v) => typeof v === 'number');
              return (
                <tr key={id}>
                  <td>{RATING_LABELS[id]}</td>
                  <td className="eres-barra-celda">
                    <div className="eres-barra">
                      <div className="eres-barra-fill" style={{ width: `${(avg(nums) / 5) * 100}%` }} />
                    </div>
                  </td>
                  <td className="eres-num">{avg(nums)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="eres-card">
        <h3>FDA / EMR (iberdomida)</h3>
        <Barras counts={q5Counts} total={rows.length} />
      </div>

      <div className="eres-card">
        <h3>CELMoDs vs IMiDs (clases diferentes)</h3>
        <Barras counts={q8Counts} total={rows.length} />
      </div>

      <div className="eres-card">
        <h3>Escenarios clínicos CELMoD (selección múltiple)</h3>
        <Barras counts={q9Counts} total={rows.length} />
      </div>

      <div className="eres-card">
        <h3>Comentarios abiertos ({comentarios.length})</h3>
        {comentarios.length
          ? <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>
            {comentarios.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
          : <p className="eres-vacio">Sin comentarios.</p>}
      </div>
    </>
  );
}

function EncuestaResultados() {
  const [entrada, setEntrada] = useState([]);
  const [salida, setSalida] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('entrada');
  const [vista, setVista] = useState('tabla');

  useEffect(() => {
    const load = async () => {
      const [e, s] = await Promise.all([
        getDocs(collection(db, 'encuesta_entrada_resultados')),
        getDocs(collection(db, 'encuestas_resultados')),
      ]);
      const porFecha = (a, b) => (a.fecha?.seconds || 0) - (b.fecha?.seconds || 0);
      setEntrada(e.docs.map((d) => d.data()).sort(porFecha));
      setSalida(s.docs.map((d) => d.data()).sort(porFecha));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="eres-page">
        <div className="eres-body"><p className="eres-total">Cargando resultados...</p></div>
      </div>
    );
  }

  const rows = tab === 'entrada' ? entrada : salida;

  return (
    <div className="eres-page">
      <header className="eres-header">
        <h1>Resultados de encuestas</h1>
        <p>BLOOD 2026</p>
      </header>

      <div className="eres-body">
        <div className="eres-tabs">
          <button
            className={`eres-tab ${tab === 'entrada' ? 'eres-tab-active' : ''}`}
            onClick={() => setTab('entrada')}
          >
            Entrada ({entrada.length})
          </button>
          <button
            className={`eres-tab ${tab === 'salida' ? 'eres-tab-active' : ''}`}
            onClick={() => setTab('salida')}
          >
            Salida ({salida.length})
          </button>
        </div>

        <div className="eres-subtabs">
          <button
            className={`eres-subtab ${vista === 'tabla' ? 'eres-subtab-active' : ''}`}
            onClick={() => setVista('tabla')}
          >
            Tabla por persona
          </button>
          <button
            className={`eres-subtab ${vista === 'resumen' ? 'eres-subtab-active' : ''}`}
            onClick={() => setVista('resumen')}
          >
            Resumen
          </button>
        </div>

        <p className="eres-total">
          Respuestas registradas: <strong>{rows.length}</strong>
        </p>

        {vista === 'tabla' ? (
          tab === 'entrada'
            ? <TablaRespuestas rows={entrada} columnas={ENTRADA_COLS} />
            : <TablaRespuestas
              rows={salida}
              columnas={SALIDA_COLS}
              extra={{ label: 'Comentario abierto', campo: 'comentario_abierto' }}
            />
        ) : (
          tab === 'entrada' ? <ResumenEntrada rows={entrada} /> : <ResumenSalida rows={salida} />
        )}
      </div>
    </div>
  );
}

export default EncuestaResultados;
