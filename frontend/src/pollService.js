import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot, collection } from "firebase/firestore";

const GLOBAL_DOC = "global_state";
const GLOBAL_COL = "live_polls";
const VOTES_COL = "live_polls_votes";

const INITIAL_DB = {
  activePolls: {},
  votes: {},
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

    // Ensure vote document exists
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
    await updateDoc(globalRef, {
      [`pollsClosed.${pollId}`]: true
    });
  } catch(e) { console.error("Error closing poll", e); }
}

export async function finishPoll(confId) {
  const globalRef = doc(db, GLOBAL_COL, GLOBAL_DOC);
  try {
    // This removes the active poll from this conference so it goes to "Thanks for participating" mode
    await updateDoc(globalRef, {
      [`activePolls.${confId}`]: null
    });
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
    
    // setDoc with merge behaves like updateDoc but safely builds missing maps
    await setDoc(pollRef, {
      options: opts,
      users: usersMap
    }, { merge: true });

  } catch(e) { console.error("Error generating random votes", e); }
}

export async function resetPoll(pollId) {
  const globalRef = doc(db, GLOBAL_COL, GLOBAL_DOC);
  const pollRef = doc(db, VOTES_COL, pollId);

  try {
    await updateDoc(globalRef, {
      [`pollsClosed.${pollId}`]: false
    });
    // Wipe specific poll doc (all user votes and counts)
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

      // setDoc with merge: true is bulletproof and will auto-create the doc if 
      // the presenter's async function was delayed or failed to build the skeleton.
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

export function useLiveDB() {
  const [dbState, setDbState] = useState(INITIAL_DB);

  useEffect(() => {
    // Listener 1: Global configurations and states
    const unsubGlobal = onSnapshot(doc(db, GLOBAL_COL, GLOBAL_DOC), (docSnap) => {
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
    });

    // Listener 2: All Active/Closed Poll Votes Data
    const unsubVotes = onSnapshot(collection(db, VOTES_COL), (snapshot) => {
      const newVotes = {};
      const newUserVotes = {};

      snapshot.forEach(docSnap => {
        const pollId = docSnap.id;
        const data = docSnap.data();
        newVotes[pollId] = data.options || {};
        
        const usersMap = data.users || {};
        Object.keys(usersMap).forEach(uid => {
          if (!newUserVotes[uid]) newUserVotes[uid] = {};
          newUserVotes[uid][pollId] = usersMap[uid];
        });
      });

      setDbState(prev => ({
        ...prev,
        votes: { ...prev.votes, ...newVotes },
        userVotes: newUserVotes
      }));

    }, (error) => {
       console.error("Votes Snapshot error:", error);
    });

    return () => {
      unsubGlobal();
      unsubVotes();
    };
  }, []);

  return dbState;
}
