'use client';

import { useEffect } from 'react';
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import GloriaFoodWidget from '@/components/GloriaFoodWidget';
import styles from './page.module.css';

export default function Home() {
    useEffect(() => {
        // Charger le script GloriaFood
        const script = document.createElement('script');
        script.src = 'https://www.fbgcdn.com/embedder/js/ewm2.js';
        script.defer = true;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <main className={styles.main}>
            <Hero />

            {/* Menu du Jour Section */}
            <section className={styles.menuDuJourSection}>
                <div className={styles.container}>
                    <div className={styles.menuDuJourContent}>
                        <div className={styles.menuDuJourHeader}>
                            <h2>🍽️ Menu du Jour</h2>
                            <p className={styles.menuDuJourSubtitle}>Mis à jour chaque semaine</p>
                        </div>

                        <div className={styles.menuDuJourViewer}>
                            {/* Remplacez le lien ci-dessous par votre lien Dropbox */}
                            <iframe
                                src="https://www.dropbox.com/s/VOTRE_LIEN_ICI/menu-du-jour.pdf?dl=1"
                                className={styles.pdfFrame}
                                title="Menu du Jour"
                            />
                            <div className={styles.menuDuJourActions}>
                                <a
                                    href="https://www.dropbox.com/s/VOTRE_LIEN_ICI/menu-du-jour.pdf?dl=1"
                                    className={styles.btnDownload}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    📥 Télécharger le Menu
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className={styles.section} id="about">
                <div className={styles.container}>
                    <div className={styles.textCenter}>
                        <h2 className={styles.sectionTitle}>Bienvenue au Restaurant-Pizzeria Pepperoni</h2>
                        <p className={styles.sectionSubtitle}>
                            Une expérience culinaire authentique à Diekirch
                        </p>
                    </div>

                    <div className={styles.aboutContent}>
                        <div className={styles.aboutText}>
                            <p>
                                Bienvenue au <strong>Restaurant-Pizzeria Pepperoni</strong>, situé à Diekirch, où nous vous
                                accueillons du mardi au dimanche dans une ambiance chaleureuse et conviviale.
                            </p>
                            <p>
                                Notre établissement propose une <strong>cuisine authentique française, portugaise et italienne</strong>,
                                préparée avec des ingrédients frais et de qualité. Que ce soit pour un déjeuner rapide, un dîner
                                en famille ou entre amis, nous nous engageons à vous offrir une expérience culinaire mémorable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className={styles.sectionDark} id="services">
                <div className={styles.container}>
                    <div className={styles.textCenter}>
                        <h2 className={styles.sectionTitleLight}>Nos Services</h2>
                        <p className={styles.sectionSubtitleLight}>
                            Flexibilité et qualité pour votre plus grand plaisir
                        </p>
                    </div>

                    <div className={styles.grid}>
                        <ServiceCard
                            icon="🍽️"
                            title="Sur Place"
                            description="Profitez d'une ambiance cosy et conviviale dans notre restaurant chaleureux"
                        />
                        <ServiceCard
                            icon="📦"
                            title="À Emporter"
                            description="Commandez vos plats préférés et venez les chercher à votre convenance"
                        />
                        <ServiceCard
                            icon="🚀"
                            title="Livraison"
                            description="Profitez de notre service de livraison rapide et fiable à domicile"
                        />
                    </div>
                </div>
            </section>

            {/* Commander en Ligne Section - GloriaFood */}
            <section className={styles.orderSection}>
                <div className={styles.container}>
                    <div className={styles.orderContent}>
                        <div className={styles.orderTextBox}>
                            <h2>Commander en Ligne</h2>
                            <p>
                                Commandez directement en ligne via GloriaFood pour la livraison à domicile ou le retrait au restaurant.
                                Menu complet avec tous les prix !
                            </p>
                        </div>
                        <GloriaFoodWidget
                            showOrderButton={true}
                            showReservationButton={true}
                        />
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section className={styles.section} id="specialties">
                <div className={styles.container}>
                    <div className={styles.textCenter}>
                        <h2 className={styles.sectionTitle}>Nos Spécialités</h2>
                        <p className={styles.sectionSubtitle}>
                            Un large choix pour ravir tous les palais
                        </p>
                    </div>

                    <div className={styles.specialtiesGrid}>
                        <div className={styles.specialtyCard}>
                            <div className={styles.specialtyImage} style={{
                                backgroundImage: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80)'
                            }}></div>
                            <div className={styles.specialtyContent}>
                                <h3>Pizzas Artisanales</h3>
                                <p>
                                    Nos pizzas sont préparées avec des ingrédients frais et cuites au four traditionnel.
                                    Pâte fine et croustillante, garnitures généreuses.
                                </p>
                            </div>
                        </div>

                        <div className={styles.specialtyCard}>
                            <div className={styles.specialtyImage} style={{
                                backgroundImage: 'url(https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80)'
                            }}></div>
                            <div className={styles.specialtyContent}>
                                <h3>Pâtes Fraîches</h3>
                                <p>
                                    Découvrez nos pâtes fraîches préparées selon les traditions italiennes,
                                    accompagnées de sauces maison savoureuses.
                                </p>
                            </div>
                        </div>

                        <div className={styles.specialtyCard}>
                            <div className={styles.specialtyImage} style={{
                                backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80)'
                            }}></div>
                            <div className={styles.specialtyContent}>
                                <h3>Cuisine Traditionnelle</h3>
                                <p>
                                    Plats français et portugais authentiques, préparés avec passion et
                                    savoir-faire pour une expérience gastronomique unique.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className={styles.sectionDark} id="contact">
                <div className={styles.container}>
                    <div className={styles.contactGrid}>
                        <div className={styles.contactInfo}>
                            <h2 className={styles.sectionTitleLight}>Nous Contacter</h2>
                            <p className={styles.contactText}>
                                N'hésitez pas à nous contacter pour toute question ou pour réserver votre table.
                            </p>

                            <div className={styles.contactDetails}>
                                <div className={styles.contactItem}>
                                    <div className={styles.contactIcon}>📞</div>
                                    <div>
                                        <h4>Téléphone</h4>
                                        <a href="tel:+35226800414">+352 26 80 04 14</a>
                                    </div>
                                </div>

                                <div className={styles.contactItem}>
                                    <div className={styles.contactIcon}>✉️</div>
                                    <div>
                                        <h4>Email</h4>
                                        <a href="mailto:pizzeriapepperoni2022@gmail.com">
                                            pizzeriapepperoni2022@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.contactItem}>
                                    <div className={styles.contactIcon}>📍</div>
                                    <div>
                                        <h4>Adresse</h4>
                                        <p>53, avenue de la Gare<br />L-9233 Diekirch</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cta}>
                                <a href="tel:+35226800414" className={styles.btnPrimary}>
                                    Réserver une Table
                                </a>
                                <a href="/menu" className={styles.btnOutline}>
                                    Voir le Menu
                                </a>
                            </div>
                        </div>

                        <div className={styles.hoursCard}>
                            <h3>Horaires d'Ouverture</h3>
                            <div className={styles.hoursList}>
                                <div className={styles.hourItem}>
                                    <span className={styles.day}>Lundi</span>
                                    <span className={styles.time}>Fermé</span>
                                </div>
                                <div className={styles.hourItem}>
                                    <span className={styles.day}>Mardi - Mercredi</span>
                                    <span className={styles.time}>12h-14h & 18h-22h</span>
                                </div>
                                <div className={styles.hourItem}>
                                    <span className={styles.day}>Jeudi</span>
                                    <span className={styles.time}>12h-14h (fermé le soir)</span>
                                </div>
                                <div className={styles.hourItem}>
                                    <span className={styles.day}>Vendredi</span>
                                    <span className={styles.time}>12h-14h & 18h-22h</span>
                                </div>
                                <div className={styles.hourItem}>
                                    <span className={styles.day}>Samedi</span>
                                    <span className={styles.time}>18h-22h (fermé le midi)</span>
                                </div>
                                <div className={styles.hourItem}>
                                    <span className={styles.day}>Dimanche</span>
                                    <span className={styles.time}>12h-14h & 18h-21h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
