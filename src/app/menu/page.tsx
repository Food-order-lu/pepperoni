import GloriaFoodWidget from '@/components/GloriaFoodWidget';
import styles from './page.module.css';

export const metadata = {
    title: 'Notre Menu | Restaurant PEPPERONI Diekirch',
    description: 'Découvrez notre carte : pizzas artisanales, pâtes fraîches, cuisine française et portugaise. Commandez en ligne avec GloriaFood. Restaurant Pepperoni à Diekirch.',
};

export default function MenuPage() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.overlay}></div>
                <div className={styles.heroContent}>
                    <h1>Notre Menu</h1>
                    <p>Découvrez nos spécialités et commandez en ligne</p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.menuIntro}>
                        <h2>Commandez en Ligne</h2>
                        <p>
                            Parcourez notre menu complet avec tous les prix et commandez directement en ligne.
                            Livraison à domicile ou à emporter !
                        </p>
                    </div>

                    {/* Widget GloriaFood pour commander */}
                    <div className={styles.widgetSection}>
                        <GloriaFoodWidget
                            showOrderButton={true}
                            showReservationButton={true}
                        />
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>🍕</div>
                            <h3>Pizzas Artisanales</h3>
                            <p>Plus de 25 pizzas différentes préparées avec des ingrédients frais</p>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>🍝</div>
                            <h3>Pâtes Fraîches</h3>
                            <p>Large sélection de pâtes italiennes avec sauces maison</p>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>🥘</div>
                            <h3>Cuisine Traditionnelle</h3>
                            <p>Plats français et portugais authentiques</p>
                        </div>
                    </div>

                    <div className={styles.ctaSection}>
                        <div className={styles.ctaBox}>
                            <h3>📋 Informations</h3>
                            <ul className={styles.infoList}>
                                <li>✅ Paiement sécurisé en ligne</li>
                                <li>✅ Livraison rapide à domicile</li>
                                <li>✅ Service à emporter disponible</li>
                                <li>✅ Allergies : informez-nous lors de votre commande</li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.contactInfo}>
                        <p>
                            <strong>Une question ?</strong> Appelez-nous au{' '}
                            <a href="tel:+35226800414" className={styles.phoneLink}>
                                +352 26 80 04 14
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
