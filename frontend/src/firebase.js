import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-1fl9GwYuNCs73BIL45iIZTu5V5k5Y6E",
  authDomain: "shaq-brand-bot.firebaseapp.com",
  projectId: "shaq-brand-bot",
  storageBucket: "shaq-brand-bot.firebasestorage.app",
  messagingSenderId: "612926027116",
  appId: "1:612926027116:web:1cee7d950033c3f7faaf49"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
