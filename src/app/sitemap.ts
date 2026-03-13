import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Remplacez cette URL par votre vrai nom de domaine une fois en ligne
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.restaurantpepperoni.lu'; 

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/menu`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/galerie`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/evenements`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}
