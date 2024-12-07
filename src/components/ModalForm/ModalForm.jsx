import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../store/slices/reviewsSlice';
import styles from "./ModalForm.module.scss";
import StarRating from './StarRating/StarRating';
import exiticon from '../../assets/x.png';

export default function ModalForm({ onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    rating: 0,
    email: '',
    text: ''
  });

  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const { loading, error } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (isClosing) {
      setTimeout(() => onClose(), 500); // Задержка для анимации
    }
  }, [isClosing, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Исправлено на 'name'
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.username) formErrors.username = 'Имя обязательно';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = 'Введите корректный Email';
    if (!formData.text) formErrors.text = 'Отзыв обязателен';
    if (formData.rating === 0) formErrors.rating = 'Оценка обязательна';
    return formErrors;
  };

  const handleClear = () => {
    setFormData({ username: '', rating: 0, email: '', text: '' });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return; // Защита от двойной отправки
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      dispatch(createReview(formData))
          .unwrap()
          .then(() => {
            alert('Отзыв успешно отправлен!');
            handleClear();
            setIsClosing(true);
          })
          .catch((err) => {
            alert(`Ошибка: ${err}`);
          });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsClosing(true);
    }
  };

  return (
      <div className={`${styles.overlay} ${isClosing ? styles.fadeOut : ''}`} onClick={handleOverlayClick}>
        <div className={`${styles.wrap} ${isClosing ? styles.fadeOutWrap : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none" onClick={() => setIsClosing(true)} className={styles.exitIcon}>
            <path d="M1 29L29 1M29 29L1 1" stroke="#212529" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>

          <form onSubmit={handleSubmit}>
            <div className={styles.box}>
              <p className={styles.Maintitle}>Оставьте отзыв</p>
              <div>
                <p>Введите свое ФИО</p>
                <input
                    type="text"
                    name="username" // Исправлено на 'name'
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={errors.username || '...'}
                    className={errors.username ? styles.error : ''}
                />
              </div>
              <div>
                <p>Оценка</p>
                <StarRating rating={formData.rating} onRatingChange={handleRatingChange}/>
                {errors.rating && <p className={styles.errorMessage}>{errors.rating}</p>}
              </div>
              <div>
                <p>Email</p>
                <input
                    type="email"
                    name="email" // Исправлено на 'name'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={errors.email || '...'}
                    className={errors.email ? styles.error : ''}
                />
              </div>
              <div>
                <p>Отзыв</p>
                <textarea
                    name="text" // Исправлено на 'name'
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder={errors.text || '...'}
                    className={errors.text ? styles.error : ''}
                />
              </div>
              {error && <p className={styles.errorMessage}>Ошибка: {error}</p>}
              <div className={styles.buttons}>
                <button className={styles.btn1} type="button" onClick={handleClear}>Очистить</button>
                <button className={styles.btn2} type="submit" disabled={loading}>
                  {loading ? 'Отправка...' : 'Отправить'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}
