// Bandera en Firestore de qué encuestas contestó cada usuario.
//
// La verdad de fondo siguen siendo los documentos de respuesta
// (encuesta_entrada_resultados / encuestas_resultados). Esto es un índice:
// un documento por usuario que se lee por id, sin query ni índice compuesto,
// para que el home pueda saber el estado con una sola lectura barata.
// Si el documento no existe se reconstruye consultando las respuestas.
import { db } from './firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { isEncuestaCompletada, marcarEncuestaCompletada } from './encuestaSalida';
import { isEncuestaEntradaCompletada, marcarEncuestaEntradaCompletada } from './encuestaEntrada';

const COL = 'encuestas_estado';

export const ENCUESTAS = [
  {
    clave: 'entrada',
    nombre: 'de entrada',
    coleccion: 'encuesta_entrada_resultados',
    hechaLocal: isEncuestaEntradaCompletada,
    marcarLocal: marcarEncuestaEntradaCompletada,
  },
  {
    clave: 'salida',
    nombre: 'de salida',
    coleccion: 'encuestas_resultados',
    hechaLocal: isEncuestaCompletada,
    marcarLocal: marcarEncuestaCompletada,
  },
];

/** Estado inmediato desde localStorage, para pintar sin esperar a la red. */
export function estadoLocal(agenteId) {
  return { entrada: isEncuestaEntradaCompletada(agenteId), salida: isEncuestaCompletada(agenteId) };
}

/** Marca una encuesta como contestada, en Firestore y en localStorage. */
export async function marcarContestada(agenteId, clave) {
  const enc = ENCUESTAS.find(e => e.clave === clave);
  if (enc) enc.marcarLocal(agenteId);
  if (!agenteId) return;
  try {
    await setDoc(doc(db, COL, String(agenteId)), { [clave]: true }, { merge: true });
  } catch (e) {
    // localStorage ya quedó marcado: la app sigue usable aunque falle la red.
    console.warn(`No se pudo registrar la encuesta ${clave} en Firestore:`, e.message);
  }
}

/**
 * Estado real del usuario, con Firestore como fuente. Devuelve
 * { entrada, salida }. Si la bandera no existe todavía (usuarios que
 * contestaron antes de que esto existiera) consulta las respuestas y la crea.
 */
export async function leerEstado(agenteId) {
  if (!agenteId) return estadoLocal(agenteId);

  let bandera = {};
  try {
    const snap = await getDoc(doc(db, COL, String(agenteId)));
    if (snap.exists()) bandera = snap.data();
  } catch (e) {
    console.warn('No se pudo leer el estado de encuestas:', e.message);
    return estadoLocal(agenteId);
  }

  const estado = {};
  const faltantesEnBandera = [];

  for (const enc of ENCUESTAS) {
    if (bandera[enc.clave] === true) {
      estado[enc.clave] = true;
      enc.marcarLocal(agenteId);
      continue;
    }
    try {
      const respuestas = await getDocs(query(
        collection(db, enc.coleccion),
        where('agente_id', '==', agenteId),
        where('proyecto', '==', 'Blood 2026')
      ));
      estado[enc.clave] = !respuestas.empty;
      if (!respuestas.empty) {
        enc.marcarLocal(agenteId);
        faltantesEnBandera.push(enc.clave);
      }
    } catch (e) {
      console.warn(`No se pudo verificar la encuesta ${enc.clave}:`, e.message);
      estado[enc.clave] = enc.hechaLocal(agenteId);
    }
  }

  // Rellena la bandera para que la próxima carga sea una sola lectura.
  if (faltantesEnBandera.length) {
    try {
      const parche = {};
      faltantesEnBandera.forEach(c => { parche[c] = true; });
      await setDoc(doc(db, COL, String(agenteId)), parche, { merge: true });
    } catch (e) {
      console.warn('No se pudo rellenar el estado de encuestas:', e.message);
    }
  }

  return estado;
}
