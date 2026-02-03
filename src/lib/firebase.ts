import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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

// Types pour les événements
export interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    imageUrl: string;
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

// Événements
export async function getEvents(): Promise<Event[]> {
    try {
        const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Event));
    } catch (error) {
        console.error('Erreur lecture événements:', error);
        return [];
    }
}

export async function addEvent(event: Omit<Event, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(collection(db, 'events'));
        await setDoc(docRef, {
            ...event,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        console.error('Erreur ajout événement:', error);
        return { success: false, error: error.message || 'Erreur inconnue' };
    }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, 'events', id));
        return { success: true };
    } catch (error: any) {
        console.error('Erreur suppression événement:', error);
        return { success: false, error: error.message || 'Erreur inconnue' };
    }
}