import React, { useState, useEffect } from 'react';
import styles from './StarRating.module.scss';

const StarRating = ({ rating, onRatingChange, error }) => {
  const [hover, setHover] = useState(0); // Значение для наведения

  useEffect(() => {
    if (rating === 0) {
      setHover(0); // При сбросе рейтинга, сбрасываем hover
    }
  }, [rating]);

  return (
    <div className={styles.rating}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;

        return (
          <span
            key={starValue}
            className={`${styles.star} ${starValue <= (hover || rating) ? styles.active : ''} ${error ? styles.error : ''}`}
            onClick={() => onRatingChange(starValue)} // Передаем значение рейтинга в родительский компонент
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
