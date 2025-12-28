'use client';

import { useState, useEffect } from 'react';
import { saveMenuUrl, getMenuUrl } from '@/lib/firebase';
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
    const [menuImageUrl, setMenuImageUrl] = useState('');
    const [localPreviewUrl, setLocalPreviewUrl] = useState('');
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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            // 2. Compresser l'image (très rapide avec les nouveaux paramètres)
            setUploadProgress(20);
            const compressedBlob = await resizeImage(file);
            setUploadProgress(40);

            // 3. Upload vers Cloudinary
            const formData = new FormData();
            formData.append('file', compressedBlob);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            setUploadProgress(80);

            const data = await response.json();

            if (data.secure_url) {
                // 4. Sauvegarder dans Firebase
                const result = await saveMenuUrl(data.secure_url);
                setUploadProgress(95);

                if (result.success) {
                    setMenuImageUrl(data.secure_url);
                    setLocalPreviewUrl(''); // Clear local preview, use cloud URL
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

                    <div className={styles.stepGuide}>
                        <div className={styles.step}>
                            <span className={styles.stepIcon}>📸</span>
                            <span className={styles.stepTitle}>1. Photo</span>
                            <span className={styles.stepDesc}>Prenez le menu en photo</span>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepIcon}>📤</span>
                            <span className={styles.stepTitle}>2. Upload</span>
                            <span className={styles.stepDesc}>Cliquez sur le bouton et choisissez la photo</span>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepIcon}>✨</span>
                            <span className={styles.stepTitle}>3. C'est tout !</span>
                            <span className={styles.stepDesc}>Le site se met à jour instantanément</span>
                        </div>
                    </div>

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
                            {isUploading ? `⏳ ${uploadProgress}%` : '📤 Choisir une image'}
                        </span>
                    </label>

                    {isUploading && (
                        <div className={styles.progressContainer}>
                            <div
                                className={styles.progressBar}
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorBox}>
                            ❌ {error}
                        </div>
                    )}

                    {uploadSuccess && (
                        <div className={styles.success}>
                            ✅ Menu mis à jour instantanément !
                        </div>
                    )}
                </div>

                <div className={styles.previewSection}>
                    <h3>{localPreviewUrl ? '📤 Nouveau menu (upload en cours...)' : 'Aperçu actuel'}</h3>
                    {localPreviewUrl ? (
                        <img
                            src={localPreviewUrl}
                            alt="Prévisualisation locale"
                            className={styles.previewImage}
                            style={{ opacity: 0.8 }}
                        />
                    ) : isLoading ? (
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
