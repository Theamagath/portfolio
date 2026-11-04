import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyCx3QygTeqHbIhWdLEqyHHqPBRt5cuutDM',
  authDomain: 'portofolio-9568a.firebaseapp.com',
  projectId: 'portofolio-9568a',
  storageBucket: 'portofolio-9568a.firebasestorage.app',
  messagingSenderId: '480798486126',
  appId: '1:480798486126:web:291b6a39a573eba8ad807f',
});
export const auth = getAuth(app);
export const db = getFirestore(app);
export const contentRef = doc(db, 'portfolio', 'main');
