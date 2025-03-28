import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCKVaBpXNa_7HIs54xj7xzX8b1nhVn5cLM',
    authDomain: 'my-finances-d372c.firebaseapp.com',
    projectId: 'my-finances-d372c',
    storageBucket: 'my-finances-d372c.firebasestorage.app',
    messagingSenderId: '571412922739',
    appId: '1:571412922739:web:bffde444dcbb6de87f4506',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
