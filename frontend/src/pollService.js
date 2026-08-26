import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot, collection } from "firebase/firestore";

const GLOBAL_DOC = "global_state";
const GLOBAL_COL = "live_polls";
const VOTES_COL = "live_polls_votes";
const CONFIG_COL = "live_polls_config";

export const RANKING_MAX = 5;

const INITIAL_DB = {
  activePolls: {},
  votes: {},
  answers: {},
  userVotes: {},
  pollsClosed: {}
};

export async function setActivePoll(confId, pollId) {
  const globalRef = doc(db, GLOBAL_COL, GLOBAL_DOC);
  try {
    const snap = await getDoc(globalRef);
    if (!snap.exists()) {
      await setDoc(globalRef, { activePolls: { [confId]: pollId }, pollsClosed: {} });
    } else {
      await updateDoc(globalRef, {
        [`activePolls.${confId}`]: pollId,
        [`pollsClosed.${pollId}`]: false
      });
    }
    const pollRef = doc(db, VOTES_COL, pollId);
    const pSnap = await getDoc(pollRef);
    if (!pSnap.exists()) {
        await setDoc(pollRef, { options: {}, users: {} });
    }
  } catch(e) { console.error("Error setting active poll", e); }
}

export async function closePoll(pollId) {
  const globalRef = doc(db, GLOBAL_COL, GLOBAL_DOC);
  try {
    await updateDoc(globalRef, { [`pollsClosed.${pollId}`]: true });
  } catch(e) { console.error("Error closing poll", e); }
}

export async function finishPoll(confId) {
  const globalRef = doc(db, GLOBAL_COL, GLOBAL_DOC);
  try {
    await updateDoc(globalRef, { [`activePolls.${confId}`]: null });
  } catch(e) { console.error("Error finishing poll", e); }
}

export async function generateRandomVotes(pollId, options) {
  const pollRef = doc(db, VOTES_COL, pollId);
  try {
    let opts = {};
    let usersMap = {};
    options.forEach(opt => {
        opts[opt.id] = increment(Math.floor(Math.random() * 40) + 10);
        usersMap[`fake_${Math.random().toString(36).substring(2, 7)}`] = opt.id;
    });
    await setDoc(pollRef, { options: opts, users: usersMap }, { merge: true });
  } catch(e) { console.error("Error generating random votes", e); }
}

export async function resetPoll(pollId) {
  const globalRef = doc(db, GLOBAL_COL, GLOBAL_DOC);
  const pollRef = doc(db, VOTES_COL, pollId);
  try {
    await updateDoc(globalRef, { [`pollsClosed.${pollId}`]: false });
    await setDoc(pollRef, { options: {}, users: {} });
  } catch(e) { console.error("Error resetting poll", e); }
}

export async function castVote(userId, pollId, optionId) {
  const pollRef = doc(db, VOTES_COL, pollId);
  try {
      const pSnap = await getDoc(pollRef);
      if (pSnap.exists() && pSnap.data().users && pSnap.data().users[userId]) {
         return false; // already voted
      }
      await setDoc(pollRef, {
        options: { [optionId]: increment(1) },
        users: { [userId]: optionId }
      }, { merge: true });
      return true;
  } catch(e) {
      console.error("Error casting bulletproof vote", e);
      return false;
  }
}

export async function castVoteMultiple(userId, pollId, optionIds) {
  const pollRef = doc(db, VOTES_COL, pollId);
  try {
      const pSnap = await getDoc(pollRef);
      if (pSnap.exists() && pSnap.data().users && pSnap.data().users[userId]) {
         return false; // already voted
      }
      const optsInc = {};
      optionIds.forEach(id => { optsInc[id] = increment(1); });
      await setDoc(pollRef, {
        options: optsInc,
        users: { [userId]: optionIds }
      }, { merge: true });
      return true;
  } catch(e) {
      console.error("Error casting multiple vote", e);
      return false;
  }
}

export async function castRespuesta(userId, pollId, valor) {
  const pollRef = doc(db, VOTES_COL, pollId);
  try {
      const pSnap = await getDoc(pollRef);
      if (pSnap.exists() && pSnap.data().users && pSnap.data().users[userId] !== undefined) {
         return false; // already voted
      }
      await setDoc(pollRef, {
        users: { [userId]: valor }
      }, { merge: true });
      return true;
  } catch(e) {
      console.error("Error casting respuesta", e);
      return false;
  }
}

export async function castRanking(userId, pollId, rankedIds) {
  const pollRef = doc(db, VOTES_COL, pollId);
  try {
      const pSnap = await getDoc(pollRef);
      if (pSnap.exists() && pSnap.data().users && pSnap.data().users[userId]) {
         return false; // already voted
      }
      const optsInc = {};
      rankedIds.forEach((id, i) => { optsInc[id] = increment(rankedIds.length - i); });
      await setDoc(pollRef, {
        options: optsInc,
        users: { [userId]: rankedIds }
      }, { merge: true });
      return true;
  } catch(e) {
      console.error("Error casting ranking", e);
      return false;
  }
}

export async function savePollConfig(confId, preguntas) {
  await setDoc(doc(db, CONFIG_COL, String(confId)), { preguntas });
}

export async function deletePollConfig(confId) {
  await setDoc(doc(db, CONFIG_COL, String(confId)), { preguntas: [] });
}

export function useLiveConfigs() {
  const [configs, setConfigs] = useState({});

  useEffect(() => {
    let cancelled = false;
    let unsub = () => {};

    function subscribe() {
      unsub = onSnapshot(collection(db, CONFIG_COL), (snapshot) => {
        const next = {};
        snapshot.forEach(docSnap => {
          const preguntas = docSnap.data().preguntas || [];
          if (preguntas.length) next[docSnap.id] = preguntas;
        });
        setConfigs(next);
      }, (error) => {
        console.error("Config Snapshot error:", error);
        if (!cancelled) setTimeout(subscribe, 3000);
      });
    }

    subscribe();
    return () => { cancelled = true; unsub(); };
  }, []);

  return configs;
}

export function useLiveDB() {
  const [dbState, setDbState] = useState(INITIAL_DB);

  useEffect(() => {
    let cancelled = false;
    let unsubGlobal = () => {};
    let unsubVotes = () => {};

    function subscribeGlobal() {
      unsubGlobal = onSnapshot(doc(db, GLOBAL_COL, GLOBAL_DOC), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDbState(prev => ({
            ...prev,
            activePolls: data.activePolls || {},
            pollsClosed: data.pollsClosed || {}
          }));
        }
      }, (error) => {
        console.error("Global Snapshot error:", error);
        if (!cancelled) setTimeout(subscribeGlobal, 3000);
      });
    }

    function subscribeVotes() {
      unsubVotes = onSnapshot(collection(db, VOTES_COL), (snapshot) => {
        const newVotes = {};
        const newAnswers = {};
        const newUserVotes = {};
        snapshot.forEach(docSnap => {
          const pollId = docSnap.id;
          const data = docSnap.data();
          newVotes[pollId] = data.options || {};
          const usersMap = data.users || {};
          newAnswers[pollId] = usersMap;
          Object.keys(usersMap).forEach(uid => {
            if (!newUserVotes[uid]) newUserVotes[uid] = {};
            newUserVotes[uid][pollId] = usersMap[uid];
          });
        });
        setDbState(prev => ({
          ...prev,
          votes: { ...prev.votes, ...newVotes },
          answers: { ...prev.answers, ...newAnswers },
          userVotes: newUserVotes
        }));
      }, (error) => {
        console.error("Votes Snapshot error:", error);
        if (!cancelled) setTimeout(subscribeVotes, 3000);
      });
    }

    subscribeGlobal();
    subscribeVotes();

    return () => { cancelled = true; unsubGlobal(); unsubVotes(); };
  }, []);

  return dbState;
}
