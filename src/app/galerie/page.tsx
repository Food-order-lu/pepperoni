'use client';

import { useState } from 'react';
import styles from './page.module.css';

// Données simulées pour la galerie (à remplacer par des vraies images plus tard)
const galleryItems = [
    // Restaurant
    {
        id: 1,
        category: 'restaurant',
        src: '/hero-bg.jpg', // Placeholder
        title: 'Salle Principale',
        description: 'Ambiance chaleureuse et conviviale'
    },
    {
        id: 2,
        category: 'restaurant',
        src: '/hero-bg.jpg', // Placeholder
        title: 'Notre Four à Pizza',
        description: 'La cuisson authentique au feu de bois'
    },
    {
        id: 3,
        category: 'restaurant',
        src: '/hero-bg.jpg', // Placeholder
        title: 'Terrasse Ensoleillée',
        description: 'Profitez des beaux jours'
    },
    // Événements
    {
        id: 4,
        category: 'events',
        src: '/hero-bg.jpg', // Placeholder
        title: 'Soirée Privée',
        description: 'Organisation de baptêmes et anniversaires'
    },
    {
        id: 5,
        category: 'events',
        src: '/hero-bg.jpg', // Placeholder
        title: 'Grande Salle de Réception',
        description: 'Espace modulable pour vos événements'
    },
    {
        id: 6,
        category: 'events',
        src: '/hero-bg.jpg', // Placeholder
        title: 'Buffet Traiteur',
        description: 'Service traiteur sur mesure'
    }
];

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState('restaurant');

    const filteredItems = galleryItems.filter(item => item.category === activeTab);

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

            <div className={styles.grid}>
                {filteredItems.map((item) => (
                    <div key={item.id} className={styles.card}>
                        <img
                            src={item.src}
                            alt={item.title}
                            className={styles.image}
                        />
                        <div className={styles.overlay}>
                            <h3 className={styles.imageTitle}>{item.title}</h3>
                            <p className={styles.imageDesc}>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
