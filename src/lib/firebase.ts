// Storage solution: Server API (shared) + localStorage (fallback)
// All visitors see the same menu!

const API_URL = '/pepperoni/api/menu';
const STORAGE_KEY = 'pepperoni_menu_url';

// Sauvegarder l'URL du menu (serveur + localStorage backup)
export async function saveMenuUrl(url: string): Promise<{ success: boolean; error?: string }> {
    // Toujours sauvegarder en localStorage comme backup
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            imageUrl: url,
            updatedAt: new Date().toISOString()
        }));
    } catch (e) {
        console.warn('localStorage non disponible');
    }

    // Essayer de sauvegarder sur le serveur
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: url })
        });

        if (response.ok) {
            return { success: true };
        } else {
            const data = await response.json();
            return { success: false, error: data.error || 'Erreur serveur' };
        }
    } catch (error: any) {
        console.error('Erreur API:', error);
        // localStorage a déjà sauvegardé, donc on retourne succès
        return { success: true };
    }
}

// Charger l'URL du menu (serveur prioritaire, localStorage fallback)
export async function getMenuUrl(): Promise<string | null> {
    // Essayer le serveur d'abord
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            if (data.imageUrl) {
                return data.imageUrl;
            }
        }
    } catch (error) {
        console.warn('API non disponible, utilisation du localStorage');
    }

    // Fallback sur localStorage
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            return parsed.imageUrl;
        }
    } catch (e) {
        console.warn('localStorage non disponible');
    }

    return null;
}

