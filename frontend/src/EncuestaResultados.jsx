import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const RATING_IDS = ['q1', 'q2', 'q3', 'q4', 'q6', 'q7', 'q10'];
const RATING_LABELS = {
  q1: 'Relevancia científica',
  q2: 'Utilidad práctica clínica',
  q3: 'Calidad/claridad ponentes',
  q4: 'Profundidad de los temas',
  q6: 'Probabilidad iberdomida+dara+dexa (MMRR)',
  q7: 'Probabilidad mezigdomida+carfilzomib/bortezomib+dexa (MMRR)',
  q10: 'Experiencia general del evento',
};

function avg(nums) {
  if (!nums.length) return 0;
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2);
}

function countBy(items) {
  const counts = {};
  items.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
  return counts;
}

function EncuestaResultados() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'encuestas_resultados'));
      setRows(snap.docs.map((d) => d.data()));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 40, fontFamily: 'var(--font-inter)' }}>Cargando resultados...</div>;

  const q5Counts = countBy(rows.map((r) => r.respuestas?.q5?.opcion).filter(Boolean));
  const q8Counts = countBy(rows.map((r) => r.respuestas?.q8?.valor).filter(Boolean));
  const q9Counts = countBy(rows.flatMap((r) => r.respuestas?.q9 || []));
  const comentarios = rows.map((r) => r.comentario_abierto).filter((c) => c && c.trim());

  return (
    <div style={{ padding: 24, fontFamily: 'var(--font-inter)', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ color: '#45006a' }}>Resultados — Encuesta de salida</h1>
      <p>Total de respuestas: <strong>{rows.length}</strong></p>

      <h2 style={{ color: '#4f0180', fontSize: 18, marginTop: 24 }}>Promedios (1-5)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {RATING_IDS.map((id) => (
            <tr key={id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 0' }}>{RATING_LABELS[id]}</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>
                {avg(rows.map((r) => r.respuestas?.[id]).filter((v) => typeof v === 'number'))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ color: '#4f0180', fontSize: 18, marginTop: 24 }}>FDA / EMR (iberdomida)</h2>
      <ul>
        {Object.entries(q5Counts).map(([op, n]) => <li key={op}>{op}: <strong>{n}</strong></li>)}
      </ul>

      <h2 style={{ color: '#4f0180', fontSize: 18, marginTop: 24 }}>CELMoDs vs IMiDs (clases diferentes)</h2>
      <ul>
        {Object.entries(q8Counts).map(([op, n]) => <li key={op}>{op}: <strong>{n}</strong></li>)}
      </ul>

      <h2 style={{ color: '#4f0180', fontSize: 18, marginTop: 24 }}>Escenarios clínicos CELMoD (selección)</h2>
      <ul>
        {Object.entries(q9Counts).sort((a, b) => b[1] - a[1]).map(([op, n]) => <li key={op}>{op}: <strong>{n}</strong></li>)}
      </ul>

      <h2 style={{ color: '#4f0180', fontSize: 18, marginTop: 24 }}>Comentarios abiertos ({comentarios.length})</h2>
      <ul>
        {comentarios.map((c, i) => <li key={i} style={{ marginBottom: 6 }}>{c}</li>)}
      </ul>
    </div>
  );
}

export default EncuestaResultados;
