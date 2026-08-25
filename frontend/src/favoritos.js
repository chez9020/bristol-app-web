const storageKey = (agenteId) => `misFavoritos_${agenteId || 'guest'}`;

export function getFavoritos(agenteId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(agenteId))) || [];
  } catch {
    return [];
  }
}

export function toggleFavorito(agenteId, itemId) {
  const current = getFavoritos(agenteId);
  const next = current.includes(itemId)
    ? current.filter((id) => id !== itemId)
    : [...current, itemId];
  localStorage.setItem(storageKey(agenteId), JSON.stringify(next));
  return next;
}
