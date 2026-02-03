'use client';

import { useState, useEffect } from 'react';
import { saveMenuUrl, getMenuUrl, addGalleryImage, getGalleryImages, deleteGalleryImage, GalleryImage, getEvents, addEvent, deleteEvent, Event } from '@/lib/firebase';
import { resizeImage, createLocalPreview } from '@/lib/image';
import styles from './page.module.css';

// Configuration Cloudinary
const CLOUD_NAME = 'dsk1mj71x';
const UPLOAD_PRESET = 'Menu de la semaine pepperoni';
const ADMIN_PASSWORD = 'Pepperoni2022';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Menu States
    const [menuImageUrl, setMenuImageUrl] = useState('');
    const [localPreviewUrl, setLocalPreviewUrl] = useState('');

    // Gallery States
    const [galleryCategory, setGalleryCategory] = useState<'restaurant' | 'events'>('restaurant');
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'events'>('menu');

    // Events States
    const [events, setEvents] = useState<Event[]>([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');

    // Common Upload States
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier si déjà connecté
        const auth = sessionStorage.getItem('pepperoni_admin');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }

        // Charger l'URL de l'image depuis Firebase
        const loadMenu = async () => {
            const url = await getMenuUrl();
            if (url) {
                setMenuImageUrl(url);
            }
            setIsLoading(false);
        };

        const loadGallery = async () => {
            const images = await getGalleryImages();
            setGalleryImages(images);
        };

        const loadEventsData = async () => {
            const eventsData = await getEvents();
            setEvents(eventsData);
        };

        loadMenu();
        loadGallery();
        loadEventsData();
    }, []);

    // Protection contre la fermeture accidentelle pendant l'upload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isUploading) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isUploading]);

    // Cleanup des URLs locales
    useEffect(() => {
        return () => {
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }
        };
    }, [localPreviewUrl]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('pepperoni_admin', 'true');
            setError('');
        } else {
            setError('Mot de passe incorrect');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('pepperoni_admin');
    };

    const handleMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset states
        setUploadSuccess(false);
        setError('');
        setUploadProgress(0);

        // 1. INSTANTANÉ: Afficher la prévisualisation locale immédiatement
        const localUrl = createLocalPreview(file);
        setLocalPreviewUrl(localUrl);
        setIsUploading(true);
        setUploadProgress(10);

        try {
            // 2. Compresser l'image
            setUploadProgress(20);
            const compressedBlob = await resizeImage(file);
            setUploadProgress(40);

            // 3. Upload vers Cloudinary
            const formData = new FormData();
            formData.append('file', compressedBlob);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            setUploadProgress(80);

            const data = await response.json();

            if (data.secure_url) {
                // 4. Sauvegarder dans Firebase
                const result = await saveMenuUrl(data.secure_url);
                setUploadProgress(95);

                if (result.success) {
                    setMenuImageUrl(data.secure_url);
                    setLocalPreviewUrl(''); // Clear local preview
                    setUploadSuccess(true);
                    setUploadProgress(100);
                } else {
                    setError(`Erreur sauvegarde: ${result.error}`);
                }
            } else {
                setError('Erreur upload Cloudinary.');
            }
        } catch (err) {
            setError('Erreur de connexion. Réessayez.');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(10);
        setError('');

        try {
            setUploadProgress(30);
            const compressedBlob = await resizeImage(file);

            const formData = new FormData();
            formData.append('file', compressedBlob);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );

            setUploadProgress(70);
            const data = await response.json();

            if (data.secure_url) {
                const result = await addGalleryImage(data.secure_url, galleryCategory);
                setUploadProgress(100);

                if (result.success) {
                    const images = await getGalleryImages();
                    setGalleryImages(images);
                    setUploadSuccess(true);
                    setTimeout(() => setUploadSuccess(false), 3000);
                } else {
                    setError(`Erreur sauvegarde: ${result.error}`);
                }
            }
        } catch (err) {
            setError('Erreur upload.');
            console.error(err);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteGalleryImage = async (id: string) => {
        if (confirm('Voulez-vous vraiment supprimer cette image ?')) {
            const result = await deleteGalleryImage(id);
            if (result.success) {
                const images = await getGalleryImages();
                setGalleryImages(images);
            } else {
                alert('Erreur: ' + result.error);
            }
        }
    };

    const handleEventUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !newEventTitle || !newEventDate) {
            setError('Veuillez remplir le titre et la date');
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);
        setError('');

        try {
            setUploadProgress(30);
            const compressedBlob = await resizeImage(file);

            const formData = new FormData();
            formData.append('file', compressedBlob);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );

            setUploadProgress(70);
            const data = await response.json();

            if (data.secure_url) {
                const result = await addEvent({
                    title: newEventTitle,
                    date: newEventDate,
                    description: newEventDescription,
                    imageUrl: data.secure_url
                });
                setUploadProgress(100);

                if (result.success) {
                    const eventsData = await getEvents();
                    setEvents(eventsData);
                    setNewEventTitle('');
                    setNewEventDate('');
                    setNewEventDescription('');
                    setUploadSuccess(true);
                    setTimeout(() => setUploadSuccess(false), 3000);
                } else {
                    setError(`Erreur sauvegarde: ${result.error}`);
                }
            }
        } catch (err) {
            setError('Erreur upload.');
            console.error(err);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
            const result = await deleteEvent(id);
            if (result.success) {
                const eventsData = await getEvents();
                setEvents(eventsData);
            } else {
                alert('Erreur: ' + result.error);
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.loginCard}>
                    <div className={styles.logo}>🍕</div>
                    <h1>Administration Pepperoni</h1>
                    <p>Connectez-vous pour gérer le site</p>
                    <form onSubmit={handleLogin} className={styles.form}>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.button}>Se connecter</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.adminPanel}>
                <div className={styles.header}>
                    <h1>🍕 Admin Pepperoni</h1>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Déconnexion
                    </button>
                </div>

                <div className={styles.tabs} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => setActiveTab('menu')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '2rem',
                            border: 'none',
                            background: activeTab === 'menu' ? '#8B1538' : '#f0f0f0',
                            color: activeTab === 'menu' ? 'white' : '#333',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        📋 Menu du Jour
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '2rem',
                            border: 'none',
                            background: activeTab === 'gallery' ? '#8B1538' : '#f0f0f0',
                            color: activeTab === 'gallery' ? 'white' : '#333',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        🖼️ Gestion Galerie
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '2rem',
                            border: 'none',
                            background: activeTab === 'events' ? '#8B1538' : '#f0f0f0',
                            color: activeTab === 'events' ? 'white' : '#333',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        🎉 Événements
                    </button>
                </div>

                {activeTab === 'menu' ? (
                    <>
                        <div className={styles.uploadSection}>
                            <h2>📋 Menu de la Semaine</h2>
                            <div className={styles.stepGuide}>
                                <div className={styles.step}>
                                    <span className={styles.stepIcon}>📸</span>
                                    <span className={styles.stepTitle}>1. Photo</span>
                                </div>
                                <div className={styles.step}>
                                    <span className={styles.stepIcon}>📤</span>
                                    <span className={styles.stepTitle}>2. Upload</span>
                                </div>
                                <div className={styles.step}>
                                    <span className={styles.stepIcon}>✨</span>
                                    <span className={styles.stepTitle}>3. Fini !</span>
                                </div>
                            </div>

                            <label className={styles.uploadLabel}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMenuUpload}
                                    className={styles.fileInput}
                                    disabled={isUploading}
                                />
                                <span className={styles.uploadBtn}>
                                    {isUploading ? `⏳ ${uploadProgress}%` : '📤 Changer le Menu'}
                                </span>
                            </label>

                            {isUploading && (
                                <div className={styles.progressContainer}>
                                    <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
                                </div>
                            )}

                            {error && <div className={styles.errorBox}>❌ {error}</div>}
                            {uploadSuccess && <div className={styles.success}>✅ Menu mis à jour !</div>}
                        </div>

                        <div className={styles.previewSection}>
                            <h3>{localPreviewUrl ? '📤 Aperçu (upload...)' : 'Menu Actuel'}</h3>
                            {localPreviewUrl ? (
                                <img src={localPreviewUrl} className={styles.previewImage} style={{ opacity: 0.8 }} />
                            ) : menuImageUrl ? (
                                <img src={menuImageUrl} className={styles.previewImage} />
                            ) : (
                                <div className={styles.noImage}>Aucun menu</div>
                            )}
                        </div>
                    </>
                ) : activeTab === 'gallery' ? (
                    <div className={styles.uploadSection}>
                        <h2>🖼️ Ajouter à la Galerie</h2>

                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                            <label style={{ fontWeight: 600 }}>Catégorie :</label>
                            <select
                                value={galleryCategory}
                                onChange={(e) => setGalleryCategory(e.target.value as 'restaurant' | 'events')}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem' }}
                            >
                                <option value="restaurant">🍽️ Restaurant & Plats</option>
                                <option value="events">🎉 Événements & Fêtes</option>
                            </select>
                        </div>

                        <label className={styles.uploadLabel}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleGalleryUpload}
                                className={styles.fileInput}
                                disabled={isUploading}
                            />
                            <span className={styles.uploadBtn}>
                                {isUploading ? `⏳ ${uploadProgress}%` : '➕ Ajouter une photo'}
                            </span>
                        </label>

                        {isUploading && (
                            <div className={styles.progressContainer}>
                                <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
                            </div>
                        )}

                        {uploadSuccess && <div className={styles.success}>✅ Photo ajoutée !</div>}

                        <h3 style={{ marginTop: '2rem', textAlign: 'left', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Vos Photos</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: '1rem',
                            marginTop: '1.5rem'
                        }}>
                            {galleryImages
                                .filter(img => img.category === galleryCategory)
                                .map((img) => (
                                    <div key={img.id} style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', background: '#fff' }}>
                                        <img src={img.url} alt="Gallery" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                                        <div style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
                                            <span title={img.category}>
                                                {img.category === 'restaurant' ? '🍽️' : '🎉'}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteGalleryImage(img.id)}
                                                style={{
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '4px 8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                Supr.
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : activeTab === 'events' ? (
                    <div className={styles.uploadSection}>
                        <h2>🎉 Affiches Événements</h2>
                        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                            Ajoutez des affiches pour la section "À l'Affiche" de la page Événements.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <input
                                type="text"
                                placeholder="Titre de l'événement *"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                            <input
                                type="text"
                                placeholder="Date * (ex: 14 Fév ou 14-16 Février)"
                                value={newEventDate}
                                onChange={(e) => setNewEventDate(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '-0.5rem' }}>
                                💡 Cette date s'affichera sur le badge de l'affiche
                            </p>
                            <textarea
                                placeholder="Description (optionnel)"
                                value={newEventDescription}
                                onChange={(e) => setNewEventDescription(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem', minHeight: '80px' }}
                            />
                        </div>

                        <label className={styles.uploadLabel}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleEventUpload}
                                className={styles.fileInput}
                                disabled={isUploading}
                            />
                            <span className={styles.uploadBtn}>
                                {isUploading ? `⏳ ${uploadProgress}%` : '📤 Ajouter une affiche'}
                            </span>
                        </label>

                        {isUploading && (
                            <div className={styles.progressContainer}>
                                <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
                            </div>
                        )}

                        {error && <div className={styles.errorBox}>❌ {error}</div>}
                        {uploadSuccess && <div className={styles.success}>✅ Événement ajouté !</div>}

                        <h3 style={{ marginTop: '2rem', textAlign: 'left', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Vos Affiches</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '1rem',
                            marginTop: '1.5rem'
                        }}>
                            {events.map((event) => (
                                <div key={event.id} style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', background: '#fff' }}>
                                    <img src={event.imageUrl} alt={event.title} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
                                    <div style={{ padding: '0.75rem' }}>
                                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{event.title}</strong>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{event.date}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '0.5rem',
                                            right: '0.5rem',
                                            background: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            cursor: 'pointer',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
