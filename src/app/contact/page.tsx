'use client';

import styles from './page.module.css';

export default function ContactPage() {
    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.overlay}></div>
                <div className={styles.heroContent}>
                    <h1>Contactez-nous</h1>
                    <p>Nous sommes à votre écoute</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className={styles.contactSection}>
                <div className={styles.container}>
                    <div className={styles.infoContainer}>
                        <div className={styles.infoCard}>
                            <h3>📍 Adresse</h3>
                            <p>
                                53, avenue de la Gare<br />
                                L-9233 Diekirch<br />
                                Luxembourg
                            </p>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>📞 Téléphone</h3>
                            <p>
                                <a href="tel:+35226800414">+352 26 80 04 14</a>
                            </p>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>✉️ Email</h3>
                            <p>
                                <a href="mailto:pizzeriapepperoni2022@gmail.com">
                                    pizzeriapepperoni2022@gmail.com
                                </a>
                            </p>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>🕒 Horaires d'ouverture</h3>
                            <div className={styles.hours}>
                                <div className={styles.hourRow}>
                                    <span>Lundi</span>
                                    <span className={styles.closed}>Fermé</span>
                                </div>
                                <div className={styles.hourRow}>
                                    <span>Mardi - Mercredi</span>
                                    <span>12h-14h & 18h-22h</span>
                                </div>
                                <div className={styles.hourRow}>
                                    <span>Jeudi</span>
                                    <span>12h-14h</span>
                                </div>
                                <div className={styles.hourRow}>
                                    <span>Vendredi</span>
                                    <span>12h-14h & 18h-22h</span>
                                </div>
                                <div className={styles.hourRow}>
                                    <span>Samedi</span>
                                    <span>18h-22h</span>
                                </div>
                                <div className={styles.hourRow}>
                                    <span>Dimanche</span>
                                    <span>12h-14h & 18h-21h</span>
                                </div>
                            </div>
                        </div>

                        {/* Carte Google Maps */}
                        <div className={styles.mapCard}>
                            <h3>📍 Où nous trouver</h3>
                            <div className={styles.mapContainer}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2596.844558827314!2d6.155843676842851!3d49.86745997149027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479548c3e7f3af3b%3A0x400d1d53b7d3850!2s53%20Av.%20de%20la%20Gare%2C%209233%20Diekirch%2C%20Luxembourg!5e0!3m2!1sen!2s!4v1732541234567!5m2!1sen!2s"
                                    width="100%"
                                    height="400"
                                    style={{ border: 0, borderRadius: '1rem' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Restaurant Pepperoni Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
