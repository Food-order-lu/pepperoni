'use client';

import { useEffect } from 'react';
import styles from './GloriaFoodWidget.module.css';

interface GloriaFoodWidgetProps {
    showOrderButton?: boolean;
    showReservationButton?: boolean;
}

export default function GloriaFoodWidget({
    showOrderButton = true,
    showReservationButton = true
}: GloriaFoodWidgetProps) {
    useEffect(() => {
        // Charger le script GloriaFood
        const script = document.createElement('script');
        script.src = 'https://www.fbgcdn.com/embedder/js/ewm2.js';
        script.defer = true;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup: retirer le script quand le composant est démonté
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <div className={styles.widgetContainer}>
            {showOrderButton && (
                <span
                    className="glf-button"
                    data-glf-cuid="c9e685cc-01d3-4aff-80e6-03a6bf57a7fc"
                    data-glf-ruid="a1ff8650-bc1f-4e29-b02d-f7e9c3fa4fcb"
                >
                    Voir Menu & Commander
                </span>
            )}

            {showReservationButton && (
                <span
                    className="glf-button reservation"
                    data-glf-cuid="c9e685cc-01d3-4aff-80e6-03a6bf57a7fc"
                    data-glf-ruid="a1ff8650-bc1f-4e29-b02d-f7e9c3fa4fcb"
                    data-glf-reservation="true"
                >
                    Réserver une Table
                </span>
            )}
        </div>
    );
}
