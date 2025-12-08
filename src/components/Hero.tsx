'use client';

import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div
                className={styles.background}
                style={{ backgroundImage: "url('/pepperoni/hero-bg.jpg')" }}
            ></div>

            <div className={styles.content}>
                <div className={styles.textContent}>
                    <h1 className={styles.title}>
                        Pizzeria <span className={styles.highlight}>Pepperoni</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Cuisine authentique française, portugaise et italienne à Diekirch
                    </p>
                    <p className={styles.description}>
                        Découvrez nos pizzas artisanales, pâtes fraîches et spécialités traditionnelles
                        préparées avec passion et des ingrédients de qualité.
                    </p>
                    <div className={styles.buttons}>
                        <a
                            href="#menu"
                            className={`glf-button ${styles.btnPrimary}`}
                            data-glf-cuid="c9e685cc-01d3-4aff-80e6-03a6bf57a7fc"
                            data-glf-ruid="a1ff8650-bc1f-4e29-b02d-f7e9c3fa4fcb"
                        >
                            Voir le Menu
                        </a>
                        <a
                            href="#reservation"
                            className={`glf-button reservation ${styles.btnOutline}`}
                            data-glf-cuid="c9e685cc-01d3-4aff-80e6-03a6bf57a7fc"
                            data-glf-ruid="a1ff8650-bc1f-4e29-b02d-f7e9c3fa4fcb"
                            data-glf-reservation="true"
                        >
                            Réserver une Table
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <div className={styles.mouse}>
                    <div className={styles.wheel}></div>
                </div>
                <p>Scroll</p>
            </div>
        </section>
    );
}
