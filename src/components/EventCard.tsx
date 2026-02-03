import styles from './EventCard.module.css';
import { Event } from '@/lib/firebase';
import { motion } from 'framer-motion';

interface EventCardProps {
    event: Event;
    index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
    return (
        <motion.div
            className={`${styles.card} glass`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className={styles.imageContainer}>
                <img src={event.imageUrl} alt={event.title} className={styles.image} />
                <div className={styles.dateBadge}>
                    <span>{event.date}</span>
                </div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.description}>{event.description}</p>
            </div>
        </motion.div>
    );
}
