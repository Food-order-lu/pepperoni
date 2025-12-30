import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBEb-VBRW3ymcVl9oLjOAxAuk1L2jNC7jU",
    authDomain: "pepperoni-651c6.firebaseapp.com",
    projectId: "pepperoni-651c6",
    storageBucket: "pepperoni-651c6.firebasestorage.app",
    messagingSenderId: "1068626836984",
    appId: "1:1068626836984:web:52e0abbd1829f999426a0d",
    measurementId: "G-9RDWZNMVN3"
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

// Types pour la galerie
export interface GalleryImage {
    id: string;
    url: string;
    category: 'restaurant' | 'events';
    createdAt: string;
}

// Ajouter une image à la galerie
export async function addGalleryImage(url: string, category: 'restaurant' | 'events'): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(collection(db, 'gallery'));
        await setDoc(docRef, {
            url,
            category,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        console.error('Erreur ajout galerie:', error);
        return { success: false, error: error.message || 'Erreur inconnue' };
    }
}

// Récupérer toutes les images de la galerie
export async function getGalleryImages(): Promise<GalleryImage[]> {
    try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as GalleryImage));
    } catch (error) {
        console.error('Erreur lecture galerie:', error);
        return [];
    }
}

// Supprimer une image de la galerie
export async function deleteGalleryImage(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, 'gallery', id));
        return { success: true };
    } catch (error: any) {
        console.error('Erreur suppression galerie:', error);
        return { success: false, error: error.message || 'Erreur inconnue' };
    }
}
