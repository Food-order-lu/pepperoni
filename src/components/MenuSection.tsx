'use client';

import { useEffect, useState } from 'react';
import styles from '../app/page.module.css';

export default function MenuSection() {
    const [menuImageUrl, setMenuImageUrl] = useState<string | null>(null);

    useEffect(() => {
        // Charger l'URL de l'image depuis localStorage
        const savedUrl = localStorage.getItem('pepperoni_menu_url');
        if (savedUrl) {
            setMenuImageUrl(savedUrl);
        }
    }, []);

    return (
        <section className={styles.menuDuJourSection}>
            <div className={styles.container}>
                <div className={styles.menuDuJourContent}>
                    <div className={styles.menuDuJourHeader}>
                        <h2>🍽️ Menu de la Semaine</h2>
                        <p className={styles.menuDuJourSubtitle}>Mis à jour chaque semaine</p>
                    </div>

                    <div className={styles.menuDuJourViewer}>
                        {menuImageUrl ? (
                            <img
                                src={menuImageUrl}
                                alt="Menu de la Semaine - Restaurant Pepperoni"
                                className={styles.menuImage}
                            />
                        ) : (
                            <div className={styles.menuPlaceholder}>
                                <p>📋 Le menu de la semaine sera bientôt disponible</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
