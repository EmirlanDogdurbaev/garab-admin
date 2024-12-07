import  { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import styles from './ModalFilter.module.scss';
import "rc-slider/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { searchByPriceRange, setPriceRange } from "../../../store/slices/filters/search.js";

 function ModalFilter({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(12000000);
  const [productType, setProductType] = useState('iskender'); // Значение выбранной продукции

  const dispatch = useDispatch();
  const { min, max } = useSelector((state) => state.search.filters.priceRange);

  useEffect(() => {
    // Устанавливаем начальные значения из состояния Redux
    setMinValue(min);
    setMaxValue(max);
  }, [min, max]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 500); // Время на анимацию
    }
  };

  const handleSliderChange = (value) => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  };

  const handleMinInputChange = (e) => {
    const value = Math.max(0, Number(e.target.value.replace(/\D/g, ''))); // Убираем все нецифровые символы
    setMinValue(value);
  };

  const handleMaxInputChange = (e) => {
    const value = Math.max(0, Number(e.target.value.replace(/\D/g, ''))); // Убираем все нецифровые символы
    setMaxValue(value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Закрываем модалку при применении
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500); // Время на анимацию

    // Логика отправки или фильтрации
    const priceRange = { min: minValue, max: maxValue };
    dispatch(setPriceRange(priceRange));
    dispatch(searchByPriceRange(priceRange)); // Инициируем поиск по ценовому диапазону
    console.log('Filters submitted', { minValue, maxValue, productType });
  };

  const handleClear = () => {
    setMinValue(0);
    setMaxValue(12000000);
    setProductType('iskender'); // Или любое значение по умолчанию для радио
    dispatch(setPriceRange({ min: 0, max: 12000000 })); // Очистка фильтра цен в Redux
    dispatch(searchByPriceRange({ min: 0, max: 12000000 })); // Сброс поиска по ценовому диапазону
  };

  // Функция для форматирования чисел
  const formatNumber = (number) => {
    return number.toLocaleString('ru-RU'); // Для пробела между тысячами
  };

  return (
      <div className={`${styles.overlay} ${isClosing ? styles.fadeOut : ''}`} onClick={handleOverlayClick}>
        <div className={`${styles.wrap} ${isClosing ? styles.fadeOutWrap : ''}`}>
          {/* <img src={exiticon} alt="exit" onClick={handleOverlayClick} className={styles.exitIcon} /> */}
          <form onSubmit={handleFormSubmit}>
            <div className={styles.box}>
              <div className={styles.range}>
                <p>Цены</p>
                <Slider
                    range
                    min={0}
                    max={12000000}
                    step={2000}
                    value={[minValue, maxValue]}
                    onChange={handleSliderChange}
                    tipFormatter={(value) => formatNumber(value)} // Форматирование подсказки
                />
              </div>
              <div className={styles.vals}>
                <div>
                  <p>Мин.</p>
                  <input
                      type="text"
                      value={formatNumber(minValue)}
                      onChange={handleMinInputChange}
                  />
                </div>
                <div>
                  <p>Макс.</p>
                  <input
                      type="text"
                      value={formatNumber(maxValue)}
                      onChange={handleMaxInputChange}
                  />
                </div>
              </div>
              <div className={styles.radios}>
              <span>
                <input
                    type="radio"
                    name="product"
                    id="iskender"
                    checked={productType === 'iskender'}
                    onChange={() => setProductType('iskender')}
                />
                <p>Продукция Искендер</p>
              </span>
                <span>
                <input
                    type="radio"
                    name="product"
                    id="partners"
                    checked={productType === 'partners'}
                    onChange={() => setProductType('partners')}
                />
                <p>Продукция партнеров</p>
              </span>
              </div>
              <div className={styles.buttons}>
                <button className={styles.btn1} type="button" onClick={handleClear}>
                  Очистить
                </button>
                <button className={styles.btn2} type="submit">Применить</button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}

export default ModalFilter;
