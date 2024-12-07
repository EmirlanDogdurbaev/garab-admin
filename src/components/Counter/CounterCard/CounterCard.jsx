import { useState, useEffect } from 'react';
import styles from './CounterCard.module.scss';

// eslint-disable-next-line react/prop-types
const CounterCard = ({ counter }) => {
    const [animatedCount, setAnimatedCount] = useState(0);
    const isNumeric = /^\d+/.test(counter.count); 

    useEffect(() => {
        if (!isNumeric) return;

        const target = parseInt(counter.count.replace(/\D/g, ''), 10); 
        const duration = 2000; 
        const stepTime = 20; 
        const totalSteps = duration / stepTime; 
        const increment = target / totalSteps; 

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setAnimatedCount(target);
                clearInterval(timer);
            } else {
                setAnimatedCount(Math.ceil(current));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [counter.count, isNumeric]);

    const nonNumericPart = counter.count.replace(/\d+/g, '').trim();

    return (
        <div className={styles.CounterCard}>
            <h3>
                {isNumeric
                    ? `${animatedCount.toLocaleString()}${nonNumericPart}`
                    : counter.count}
            </h3>
            <p>{counter.description}</p>
        </div>
    );
};

export default CounterCard;
