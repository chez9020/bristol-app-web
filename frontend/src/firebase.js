import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-1fl9GwYuNCs73BIL45iIZTu5V5k5Y6E",
  authDomain: "agent-io-web.firebaseapp.com",
  projectId: "agent-io-web",
  storageBucket: "agent-io-web.firebasestorage.app",
  messagingSenderId: "612926027116",
  appId: "1:612926027116:web:1cee7d950033c3f7faaf49"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
