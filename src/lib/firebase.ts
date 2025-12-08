import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDjFl9aA4B8dtMmhBCfzp7L1VgWaUYOa7U",
    authDomain: "pepperoni-menu.firebaseapp.com",
    projectId: "pepperoni-menu",
    storageBucket: "pepperoni-menu.firebasestorage.app",
    messagingSenderId: "99813985360",
    appId: "1:99813985360:web:1d226c62a52c49f51a5555",
    measurementId: "G-R7FVEX4T7E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sauvegarder l'URL du menu dans Firestore
export async function saveMenuUrl(url: string): Promise<boolean> {
    try {
        await setDoc(doc(db, 'settings', 'menu'), {
            imageUrl: url,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        return false;
    }
}

// Charger l'URL du menu depuis Firestore
export async function getMenuUrl(): Promise<string | null> {
    try {
        const docSnap = await getDoc(doc(db, 'settings', 'menu'));
        if (docSnap.exists()) {
            return docSnap.data().imageUrl;
        }
        return null;
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        return null;
    }
}
