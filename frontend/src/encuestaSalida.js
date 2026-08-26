const storageKey = (agenteId) => `encuestaCompletada_${agenteId || 'guest'}`;

export function isEncuestaCompletada(agenteId) {
  return localStorage.getItem(storageKey(agenteId)) === 'true';
}

export function marcarEncuestaCompletada(agenteId) {
  localStorage.setItem(storageKey(agenteId), 'true');
}
