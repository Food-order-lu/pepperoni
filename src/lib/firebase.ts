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

const STORAGE_KEY = 'pepperoni_menu_url';

// Sauvegarder l'URL du menu (Firebase + localStorage backup)
export async function saveMenuUrl(url: string): Promise<{ success: boolean; error?: string }> {
    // Backup en localStorage
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                imageUrl: url,
                updatedAt: new Date().toISOString()
            }));
        }
    } catch (e) {
        console.warn('localStorage non disponible');
    }

    // Sauvegarder dans Firebase
    try {
        await setDoc(doc(db, 'settings', 'menu'), {
            imageUrl: url,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        console.error('Erreur Firebase:', error);
        return { success: false, error: error.message || 'Erreur Firebase' };
    }
}

// Charger l'URL du menu (Firebase prioritaire, localStorage fallback)
export async function getMenuUrl(): Promise<string | null> {
    // Essayer Firebase d'abord
    try {
        const docSnap = await getDoc(doc(db, 'settings', 'menu'));
        if (docSnap.exists()) {
            return docSnap.data().imageUrl;
        }
    } catch (error) {
        console.warn('Firebase non disponible, utilisation du localStorage');
    }

    // Fallback sur localStorage
    try {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                return parsed.imageUrl;
            }
        }
    } catch (e) {
        console.warn('localStorage non disponible');
    }

    return null;
}
