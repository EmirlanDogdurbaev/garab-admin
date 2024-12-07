import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Navigation} from 'swiper/modules';
import {useDispatch, useSelector} from 'react-redux';
import {searchByCategory, setFilterCategory} from "../../store/slices/filters/search.js";
import classes from './CategorySlider.module.scss';
import {useEffect} from "react";
import {fetchCategories} from "../../store/slices/getCategories.js";

const CategorySlider = ({categories}) => {
    const dispatch = useDispatch();
    const selectedCategory = useSelector((state) => state.search.filters.category);

    const handleCategoryChange = (categoryId) => {
        dispatch(setFilterCategory(categoryId)); // Обновляем фильтр
        dispatch(searchByCategory(categoryId)); // Запускаем асинхронный запрос
    };




    return (
        <div className={classes.category_slider}>
            <div className="swiper-button-prev-categories">
                <svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="30" rx="15" transform="matrix(-1 0 0 1 30 0)" fill="white"
                          fillOpacity="0.3"/>
                    <path
                        d="M17.7315 21.6531L11.6795 15.504C11.5468 15.3699 11.4723 15.1888 11.4723 15C11.4723 14.8113 11.5468 14.6302 11.6795 14.496L17.7301 8.34697C17.8628 8.21198 17.9371 8.03028 17.9371 7.841C17.9371 7.65173 17.8628 7.47003 17.7301 7.33504C17.6653 7.26856 17.5879 7.21573 17.5023 7.17966C17.4168 7.14358 17.3249 7.125 17.2321 7.125C17.1392 7.125 17.0473 7.14358 16.9618 7.17966C16.8762 7.21573 16.7988 7.26856 16.734 7.33504L10.6833 13.4828C10.2857 13.8877 10.063 14.4325 10.063 15C10.063 15.5675 10.2857 16.1124 10.6833 16.5173L16.734 22.665C16.7988 22.7317 16.8763 22.7847 16.962 22.8209C17.0477 22.8571 17.1397 22.8757 17.2327 22.8757C17.3257 22.8757 17.4178 22.8571 17.5034 22.8209C17.5891 22.7847 17.6666 22.7317 17.7315 22.665C17.8641 22.53 17.9385 22.3483 17.9385 22.1591C17.9385 21.9698 17.8641 21.7881 17.7315 21.6531Z"
                        fill="#042F36" fillOpacity="0.8"/>
                </svg>
            </div>

            {/* Основной слайдер категорий */}
            <Swiper
                slidesPerView="auto"
                spaceBetween={15}
                navigation={{
                    nextEl: '.swiper-button-next-categories',
                    prevEl: '.swiper-button-prev-categories',
                }}
                modules={[Navigation]}
                className="categoriesSwiper"
                grabCursor={true}
            >
                {categories?.map((category) => (
                    <SwiperSlide key={category.id} className={classes.categorySlide}>
                        <button
                            className={`${classes.categoryButton} ${selectedCategory && selectedCategory.id === category.id ? classes.active : ''}`}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.name}
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Кнопка для навигации вперед */}
            <div className="swiper-button-next-categories">
                <svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="30" rx="15" fill="white" fillOpacity="0.3"/>
                    <path
                        d="M12.2685 21.6531L18.3205 15.504C18.4532 15.3699 18.5277 15.1888 18.5277 15C18.5277 14.8113 18.4532 14.6302 18.3205 14.496L12.2699 8.34697C12.1372 8.21198 12.0629 8.03028 12.0629 7.841C12.0629 7.65173 12.1372 7.47003 12.2699 7.33504C12.3347 7.26856 12.4121 7.21573 12.4977 7.17966C12.5832 7.14358 12.6751 7.125 12.7679 7.125C12.8608 7.125 12.9527 7.14358 13.0382 7.17966C13.1238 7.21573 13.2012 7.26856 13.266 7.33504L19.3167 13.4828C19.7143 13.8877 19.937 14.4325 19.937 15C19.937 15.5675 19.7143 16.1124 19.3167 16.5173L13.266 22.665C13.2012 22.7317 13.1237 22.7847 13.038 22.8209C12.9523 22.8571 12.8603 22.8757 12.7673 22.8757C12.6743 22.8757 12.5822 22.8571 12.4966 22.8209C12.4109 22.7847 12.3334 22.7317 12.2685 22.665C12.1359 22.53 12.0615 22.3483 12.0615 22.1591C12.0615 21.9698 12.1359 21.7881 12.2685 21.6531Z"
                        fill="#042F36" fillOpacity="0.8"/>
                </svg>
            </div>
        </div>
    );
};

export default CategorySlider;
