import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.section}>
                        <img
                            src="/logo.png"
                            alt="Pepperoni Restaurant & Pizzeria"
                            className={styles.logoImage}
                        />
                        <p className={styles.tagline}>
                            Restaurant & Pizzeria à Diekirch
                        </p>
                        <p className={styles.text}>
                            Cuisine authentique française, portugaise et italienne depuis 2022
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Contact</h4>
                        <ul className={styles.list}>
                            <li>
                                <a href="tel:+35226800414" className={styles.link}>
                                    📞 +352 26 80 04 14
                                </a>
                            </li>
                            <li>
                                <a href="mailto:pizzeriapepperoni2022@gmail.com" className={styles.link}>
                                    ✉️ pizzeriapepperoni2022@gmail.com
                                </a>
                            </li>
                            <li className={styles.text}>
                                📍 53, avenue de la Gare<br />L-9233 Diekirch
                            </li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Horaires</h4>
                        <ul className={styles.list}>
                            <li className={styles.text}><strong>Lundi:</strong> Fermé</li>
                            <li className={styles.text}><strong>Mar-Mer:</strong> 12h-14h & 18h-22h</li>
                            <li className={styles.text}><strong>Jeudi:</strong> 12h-14h (fermé le soir)</li>
                            <li className={styles.text}><strong>Vendredi:</strong> 12h-14h & 18h-22h</li>
                            <li className={styles.text}><strong>Samedi:</strong> 18h-22h</li>
                            <li className={styles.text}><strong>Dimanche:</strong> 12h-14h & 18h-21h</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Services</h4>
                        <ul className={styles.list}>
                            <li className={styles.text}>🍽️ Sur place</li>
                            <li className={styles.text}>📦 À emporter</li>
                            <li className={styles.text}>🚀 Livraison à domicile</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © 2024 Restaurant Pepperoni. Tous droits réservés.
                    </p>
                    <p className={styles.credit}>
                        Site créé avec ❤️ pour Pepperoni
                    </p>
                </div>
            </div>
        </footer>
    );
}
