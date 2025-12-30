'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        // Charger le script GloriaFood
        const script = document.createElement('script');
        script.src = 'https://www.fbgcdn.com/embedder/js/ewm2.js';
        script.defer = true;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <img
                        src="/logo.png"
                        alt="Pepperoni Restaurant & Pizzeria"
                        className={styles.logoImage}
                    />
                </Link>

                <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <Link href="/" className={styles.navLink}>
                        Accueil
                    </Link>
                    <Link href="/menu" className={styles.navLink}>
                        Menu
                    </Link>
                    <Link href="/galerie" className={styles.navLink}>
                        Galerie
                    </Link>
                    <Link href="/contact" className={styles.navLink}>
                        Contact
                    </Link>
                </div>

                <div className={styles.ctaButtons}>
                    <a
                        href="#reservation"
                        className={`glf-button reservation ${styles.btnSecondary}`}
                        data-glf-cuid="c9e685cc-01d3-4aff-80e6-03a6bf57a7fc"
                        data-glf-ruid="a1ff8650-bc1f-4e29-b02d-f7e9c3fa4fcb"
                        data-glf-reservation="true"
                    >
                        Réserver
                    </a>
                    <a
                        href="#order"
                        className={`glf-button ${styles.btnPrimary}`}
                        data-glf-cuid="c9e685cc-01d3-4aff-80e6-03a6bf57a7fc"
                        data-glf-ruid="a1ff8650-bc1f-4e29-b02d-f7e9c3fa4fcb"
                    >
                        Commander
                    </a>
                </div>

                <button
                    className={styles.mobileMenuToggle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={styles.hamburger}></span>
                    <span className={styles.hamburger}></span>
                    <span className={styles.hamburger}></span>
                </button>
            </div>
        </nav>
    );
}
