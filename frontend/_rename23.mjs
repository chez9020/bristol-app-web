import { readFileSync, writeFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore';

const APPLY = process.argv.includes('--apply');
const src = readFileSync('./src/firebase.js', 'utf8');
const cfg = Object.fromEntries([...src.matchAll(/(\w+):\s*"([^"]+)"/g)].map(m => [m[1], m[2]]));
const db = getFirestore(initializeApp(cfg));

const IDS = ['p1','p2','p3','p4','p5'];
const nuevo = (id) => `p23_${id.slice(1)}`;

const backup = {};

// 1. config conf 23
const cfgRef = doc(db, 'live_polls_config', '23');
const cfgSnap = await getDoc(cfgRef);
const preguntas = cfgSnap.data().preguntas || [];
backup.config_23 = preguntas;
const preguntasNuevas = preguntas.map(p => IDS.includes(p.id) ? { ...p, id: nuevo(p.id) } : p);

// 2. votos
for (const id of IDS) {
  const s = await getDoc(doc(db, 'live_polls_votes', id));
  backup[`votes_${id}`] = s.exists() ? s.data() : null;
}

// 3. global_state
const gRef = doc(db, 'live_polls', 'global_state');
const g = (await getDoc(gRef)).data();
backup.global_state = g;

writeFileSync('/private/tmp/claude-501/-Users-juanmartinezgomez-Documents-apps-bristol-app-web/4e6ccbe0-3cce-4d60-ab5b-0fbc39f1fa79/scratchpad/backup_conf23.json', JSON.stringify(backup, null, 2));

console.log('--- PLAN ---');
preguntas.forEach(p => IDS.includes(p.id) && console.log(`config 23: ${p.id} -> ${nuevo(p.id)} (${p.tipo})`));
for (const id of IDS) {
  const d = backup[`votes_${id}`];
  console.log(`votos: ${id} -> ${nuevo(id)} | users=${d ? Object.keys(d.users||{}).length : 0} | luego se borra ${id}`);
}
console.log('pollsClosed: quitar', IDS.filter(i => g?.pollsClosed && i in g.pollsClosed).join(', ') || '(ninguno)');
console.log('activePolls["23"]:', g?.activePolls?.['23'] ?? '(sin panel activo)');
console.log('backup ->', 'scratchpad/backup_conf23.json');

if (!APPLY) { console.log('\nDRY RUN. Nada escrito.'); process.exit(0); }

await setDoc(cfgRef, { preguntas: preguntasNuevas });
for (const id of IDS) {
  const d = backup[`votes_${id}`];
  if (d) { await setDoc(doc(db, 'live_polls_votes', nuevo(id)), d); await deleteDoc(doc(db, 'live_polls_votes', id)); }
}
const limpiar = {};
IDS.forEach(i => { if (g?.pollsClosed && i in g.pollsClosed) limpiar[`pollsClosed.${i}`] = deleteField(); });
if (g?.activePolls?.['23'] && IDS.includes(g.activePolls['23'])) limpiar['activePolls.23'] = nuevo(g.activePolls['23']);
if (Object.keys(limpiar).length) await updateDoc(gRef, limpiar);
console.log('\nAPLICADO.');
process.exit(0);
