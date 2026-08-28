const storageKey = (agenteId) => `encuestaEntradaCompletada_${agenteId || 'guest'}`;

export function isEncuestaEntradaCompletada(agenteId) {
  return localStorage.getItem(storageKey(agenteId)) === 'true';
}

export function marcarEncuestaEntradaCompletada(agenteId) {
  localStorage.setItem(storageKey(agenteId), 'true');
}
