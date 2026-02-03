'use client';

import { useEffect, useState } from 'react';
import { getEvents, Event } from '@/lib/firebase';
import EventCard from '@/components/EventCard';
import styles from './page.module.css';
import { motion } from 'framer-motion';

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvents() {
            const data = await getEvents();
            setEvents(data);
            setLoading(false);
        }
        loadEvents();
    }, []);

    // Dummy events for demonstration if none in Firebase
    const displayEvents = events.length > 0 ? events : [
        {
            id: '1',
            title: 'Soirée Jazz',
            date: 'Vendredi 2 Février',
            description: 'Une soirée élégante avec le trio de jazz local. Menu dégustation spécial.',
            imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8d4ada6bf?q=80&w=1000&auto=format&fit=crop',
            createdAt: ''
        },
        {
            id: '2',
            title: 'Dégustation Vin',
            date: 'Jeudi 15 Février',
            description: 'Découvrez les crus de la région accompagnés de nos planches de charcuterie.',
            imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop',
            createdAt: ''
        },
        {
            id: '3',
            title: 'La Dolce Vita',
            date: 'Samedi 1 Mars',
            description: 'Grand buffet italien et ambiance rétro. Sortez vos plus belles tenues.',
            imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab752?q=80&w=1000&auto=format&fit=crop',
            createdAt: ''
        }
    ];

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className="container">
                    <motion.div
                        className={styles.heroContent}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1>Nos Événements</h1>
                        <p>Célébrez vos moments uniques chez Pepperoni</p>
                    </motion.div>
                </div>
            </section>

            {/* La Salle Section */}
            <section className="section">
                <div className="container">
                    <div className={styles.roomGrid}>
                        <motion.div
                            className={styles.roomText}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2>La Salle</h2>
                            <p>
                                Notre espace intime accueille jusqu'à 50 convives dans une ambiance feutrée et chaleureuse.
                                Lumières tamisées, boiseries et touches dorées créent le cadre parfait pour vos soirées privées,
                                anniversaires ou repas d'entreprise.
                            </p>
                            <p>
                                Nous proposons des menus personnalisés adaptés à vos envies et à votre budget.
                            </p>
                            <a href="/contact" className="btn btn-primary">Privatiser la salle</a>
                        </motion.div>
                        <motion.div
                            className={styles.roomImageContainer}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <img
                                src="/salle-events.jpg"
                                alt="Salle du restaurant Pepperoni"
                                className={styles.roomImage}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="section">
                <div className="container">
                    <header className={styles.sectionHeader}>
                        <h2>À l'Affiche</h2>
                        <div className={styles.divider}></div>
                    </header>

                    <div className={styles.eventsGrid}>
                        {displayEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
