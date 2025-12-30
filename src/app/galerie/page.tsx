'use client';

import { useState, useEffect } from 'react';
import { getGalleryImages, GalleryImage } from '@/lib/firebase';
import styles from './page.module.css';

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState<'restaurant' | 'events'>('restaurant');
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    // Lightbox State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            const data = await getGalleryImages();
            setImages(data);
            setLoading(false);
        };
        fetchImages();
    }, []);

    const filteredItems = images.filter(item => item.category === activeTab);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Notre Galerie</h1>
                <p className={styles.subtitle}>
                    Découvrez l'ambiance du restaurant et nos espaces pour vos événements
                </p>
            </header>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'restaurant' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('restaurant')}
                >
                    Restaurant & Plats
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'events' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('events')}
                >
                    Événements
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Chargement...</div>
            ) : filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666', background: '#f9f9f9', borderRadius: '1rem' }}>
                    Aucune photo dans cette catégorie pour le moment.
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className={styles.card}
                            onClick={() => setSelectedImage(item.url)}
                        >
                            <img
                                src={item.url}
                                alt="Galerie Pepperoni"
                                className={styles.image}
                            />
                            <div className={styles.overlay}>
                                <h3 className={styles.imageTitle}>Pepperoni</h3>
                                <p className={styles.imageDesc}>
                                    Agrandir 🔍
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* LIGHTBOX MODAL */}
            {selectedImage && (
                <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
                    <button className={styles.closeButton} onClick={() => setSelectedImage(null)}>&times;</button>
                    <img
                        src={selectedImage}
                        alt="Agrandissement"
                        className={styles.lightboxImage}
                        onClick={(e) => e.stopPropagation()} // Permet de ne pas fermer si on clique sur l'image
                    />
                </div>
            )}
        </div>
    );
}
