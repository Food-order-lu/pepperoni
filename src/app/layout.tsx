import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
    title: 'Restaurant PEPPERONI Diekirch | Pizzeria & Cuisine Française, Portugaise, Italienne',
    description: 'Restaurant Pepperoni à Diekirch : cuisine italienne et française, pizzas artisanales, pâtes et plats traditionnels. Sur place, à emporter ou livraison rapide. Réservez votre table dès maintenant !',
    keywords: 'restaurant Diekirch, pizzeria Luxembourg, cuisine italienne, cuisine française, cuisine portugaise, pizza artisanale, pâtes fraîches, livraison restaurant, à emporter Diekirch',
    openGraph: {
        title: 'Restaurant PEPPERONI Diekirch',
        description: 'Cuisine italienne, française et portugaise authentique à Diekirch',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
