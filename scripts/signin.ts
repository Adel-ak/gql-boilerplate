/*
  THIS FILE IS ONLY FOR DEVELOPMENT, 
  ITS PROPERS IS TO GET A SIGN IN TOKEN
  TO USE IT FOR TESTING.
 */

import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'apiKey_KEY',
  authDomain: 'authDomain_KEY',
  projectId: 'projectId_KEY',
  storageBucket: 'storageBucket_KEY',
  messagingSenderId: 'messagingSenderId_KEY',
  appId: 'appId_KEY',
  measurementId: 'measurementId_KEY',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

(async () => {
  await signInWithEmailAndPassword(auth, 'email', 'password');
  const token = await auth.currentUser?.getIdToken();
  console.log('authorization', 'Bearer', token);
})();
