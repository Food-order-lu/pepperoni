'use client';

import { useState, useEffect } from 'react';
import { saveMenuUrl, getMenuUrl } from '@/lib/firebase';
import { resizeImage } from '@/lib/image';
import styles from './page.module.css';

// Configuration Cloudinary
const CLOUD_NAME = 'dsk1mj71x';
const UPLOAD_PRESET = 'Menu de la semaine pepperoni';
const ADMIN_PASSWORD = 'Pepperoni2022';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [menuImageUrl, setMenuImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier si déjà connecté
        const auth = sessionStorage.getItem('pepperoni_admin');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }

        // Charger l'URL de l'image depuis Firebase
        const loadMenuUrl = async () => {
            const url = await getMenuUrl();
            if (url) {
                setMenuImageUrl(url);
            }
            setIsLoading(false);
        };
        loadMenuUrl();
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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadSuccess(false);
        setError('');
        setUploadStatus('Optimisation de l\'image...');

        try {
            // 1. Compresser l'image
            const compressedBlob = await resizeImage(file);

            setUploadStatus('Upload en cours...');
            const formData = new FormData();
            formData.append('file', compressedBlob);
            formData.append('upload_preset', UPLOAD_PRESET);

            // 2. Upload vers Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                setUploadStatus('Sauvegarde...');
                // 3. Sauvegarder dans Firebase
                const saved = await saveMenuUrl(data.secure_url);
                if (saved) {
                    setMenuImageUrl(data.secure_url);
                    setUploadSuccess(true);
                } else {
                    setError('Image uploadée mais erreur lors de la sauvegarde. Réessayez.');
                }
            } else {
                setError('Erreur lors de l\'upload. Vérifiez la configuration Cloudinary.');
            }
        } catch (err) {
            setError('Erreur de connexion. Réessayez.');
            console.error(err);
        } finally {
            setIsUploading(false);
            setUploadStatus('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.loginCard}>
                    <div className={styles.logo}>🍕</div>
                    <h1>Administration Pepperoni</h1>
                    <p>Connectez-vous pour gérer le menu de la semaine</p>

                    <form onSubmit={handleLogin} className={styles.form}>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.button}>
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.adminPanel}>
                <div className={styles.header}>
                    <h1>🍕 Gestion du Menu</h1>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Déconnexion
                    </button>
                </div>

                <div className={styles.uploadSection}>
                    <h2>📋 Menu de la Semaine</h2>
                    <p>Uploadez une nouvelle image pour mettre à jour le menu affiché sur le site.</p>
                    <p className={styles.infoText}>✨ L'image sera visible par tous les visiteurs du site !</p>

                    <label className={styles.uploadLabel}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className={styles.fileInput}
                            disabled={isUploading}
                        />
                        <span className={styles.uploadBtn}>
                            {isUploading ? (uploadStatus || '⏳ Traitement...') : '📤 Choisir une image'}
                        </span>
                    </label>

                    {error && (
                        <div className={styles.errorBox}>
                            ❌ {error}
                        </div>
                    )}

                    {uploadSuccess && (
                        <div className={styles.success}>
                            ✅ Image mise à jour avec succès ! Tous les visiteurs peuvent maintenant la voir.
                        </div>
                    )}
                </div>

                <div className={styles.previewSection}>
                    <h3>Aperçu actuel</h3>
                    {isLoading ? (
                        <div className={styles.noImage}>Chargement...</div>
                    ) : menuImageUrl ? (
                        <img
                            src={menuImageUrl}
                            alt="Menu de la semaine"
                            className={styles.previewImage}
                        />
                    ) : (
                        <div className={styles.noImage}>
                            Aucune image de menu uploadée
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
