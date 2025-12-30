'use client';

import { useEffect, useState } from 'react';
import { getMenuUrl } from '@/lib/firebase';
import styles from '../app/page.module.css';

export default function MenuSection() {
    const [menuImageUrl, setMenuImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Charger l'URL de l'image depuis Firebase
        const loadMenuUrl = async () => {
            try {
                const url = await getMenuUrl();
                if (url) {
                    setMenuImageUrl(url);
                }
            } catch (error) {
                console.error('Erreur chargement menu:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadMenuUrl();
    }, []);

    return (
        <section className={styles.menuDuJourSection}>
            <div className={styles.container}>
                <div className={styles.menuDuJourContent} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0', background: 'transparent', boxShadow: 'none' }}>
                    <div className={styles.menuDuJourViewer} style={{ width: '100%', maxWidth: '900px' }}>
                        {isLoading ? (
                            <div className={styles.menuPlaceholder}>
                                <p>⏳ Chargement du menu...</p>
                            </div>
                        ) : menuImageUrl ? (
                            <img
                                src={menuImageUrl}
                                alt="Menu de la Semaine - Restaurant Pepperoni"
                                className={styles.menuImage}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '1rem',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    display: 'block'
                                }}
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
