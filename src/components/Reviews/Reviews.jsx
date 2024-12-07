import styles from "./Reviews.module.scss";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchReviews} from "../../store/slices/reviewsSlice.js";
import ModalForm from "../ModalForm/ModalForm";
import {useTranslation} from "react-i18next"; // Подключаем компонент модального окна


const Reviews = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data: reviews, loading, error } = useSelector((state) => state.reviews);
    const [isModalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        dispatch(fetchReviews());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.Reviews}>
            <section className={styles.title}>
                <h3>{t("reviews.title")}</h3>
                <Link onClick={() => setModalOpen(true)}>{t("reviews.button")}</Link>
            </section>
            <section className={styles.container}>
                <Swiper
                    slidesPerView={1}
                    navigation={{
                        nextEl: `.${styles.next}`,
                        prevEl: `.${styles.prev}`,
                    }}
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination]}
                    className={styles.reviews_slider_cont}
                >
                    {reviews?.map((review) => (
                        <SwiperSlide className={styles.slide} key={review.id}>
                            <div>
                                <div className={styles.quoteIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="56" viewBox="0 0 57 56" fill="none">
                                        <path
                                            d="M10.0995 3.73242C8.6143 3.73242 7.18992 4.32242 6.13971 5.37262C5.08951 6.42283 4.49951 7.84721 4.49951 9.33242V37.3324C4.49951 41.293 6.07284 45.0913 8.87338 47.8919C11.6739 50.6924 15.4723 52.2658 19.4328 52.2658V48.5324C16.4624 48.5324 13.6137 47.3524 11.5132 45.252C9.41284 43.1516 8.23285 40.3028 8.23285 37.3324V26.1324H21.2995C22.7847 26.1324 24.2091 25.5424 25.2593 24.4922C26.3095 23.442 26.8995 22.0176 26.8995 20.5324V9.33242C26.8995 7.84721 26.3095 6.42283 25.2593 5.37262C24.2091 4.32242 22.7847 3.73242 21.2995 3.73242H10.0995ZM36.2328 3.73242C34.7476 3.73242 33.3232 4.32242 32.273 5.37262C31.2228 6.42283 30.6328 7.84721 30.6328 9.33242V37.3324C30.6328 41.293 32.2062 45.0913 35.0067 47.8919C37.8073 50.6924 41.6056 52.2658 45.5662 52.2658V48.5324C42.5958 48.5324 39.747 47.3524 37.6466 45.252C35.5462 43.1516 34.3662 40.3028 34.3662 37.3324V26.1324H47.4328C48.9181 26.1324 50.3424 25.5424 51.3926 24.4922C52.4428 23.442 53.0328 22.0176 53.0328 20.5324V9.33242C53.0328 7.84721 52.4428 6.42283 51.3926 5.37262C50.3424 4.32242 48.9181 3.73242 47.4328 3.73242H36.2328Z"
                                            fill="#212529"
                                        />
                                    </svg>
                                </div>
                                <p>{review.text}</p>
                                <ul className={styles.stars}>
                                    {[...Array(review.rating)].map((_, index) => (
                                        <li key={index}>⭐</li>
                                    ))}
                                </ul>
                                <h6>{review.username}</h6>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button className={styles.prev}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
                        <g clipPath="url(#clip0_655_1933)">
                            <path
                                d="M11.8033 16.8362L6.03956 10.9799C5.91315 10.8522 5.84224 10.6797 5.84224 10.4999C5.84224 10.3202 5.91315 10.1477 6.03956 10.0199L11.8021 4.16368C11.9284 4.03512 11.9992 3.86207 11.9992 3.68181C11.9992 3.50155 11.9284 3.3285 11.8021 3.19993C11.7403 3.13662 11.6666 3.08631 11.5851 3.05195C11.5036 3.0176 11.4161 2.9999 11.3277 2.9999C11.2393 2.9999 11.1517 3.0176 11.0703 3.05195C10.9888 3.08631 10.915 3.13662 10.8533 3.19993L5.09081 9.05493C4.71215 9.44059 4.5 9.95946 4.5 10.4999C4.5 11.0404 4.71215 11.5593 5.09081 11.9449L10.8533 17.7999C10.915 17.8634 10.9889 17.9139 11.0705 17.9484C11.1521 17.9829 11.2397 18.0006 11.3283 18.0006C11.4169 18.0006 11.5045 17.9829 11.5861 17.9484C11.6677 17.9139 11.7416 17.8634 11.8033 17.7999C11.9297 17.6714 12.0004 17.4983 12.0004 17.3181C12.0004 17.1378 11.9297 16.9648 11.8033 16.8362Z"
                                fill="#212529"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_655_1933">
                                <rect width="20" height="17.5" fill="white" transform="matrix(0 -1 1 0 0.75 20.5)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </button>
                <button className={styles.next}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
                        <g clipPath="url(#clip0_655_1942)">
                            <path
                                d="M7.19669 4.16382L12.9604 10.0201C13.0869 10.1478 13.1578 10.3203 13.1578 10.5001C13.1578 10.6798 13.0869 10.8523 12.9604 10.9801L7.19794 16.8363C7.0716 16.9649 7.0008 17.1379 7.0008 17.3182C7.0008 17.4984 7.0716 17.6715 7.19794 17.8001C7.25966 17.8634 7.33343 17.9137 7.41491 17.948C7.49638 17.9824 7.5839 18.0001 7.67232 18.0001C7.76074 18.0001 7.84826 17.9824 7.92973 17.948C8.0112 17.9137 8.08497 17.8634 8.14669 17.8001L13.9092 11.9451C14.2879 11.5594 14.5 11.0405 14.5 10.5001C14.5 9.95959 14.2879 9.44072 13.9092 9.05507L8.14669 3.20007C8.08495 3.13656 8.01111 3.08609 7.92952 3.05162C7.84793 3.01715 7.76026 2.99939 7.67169 2.99939C7.58312 2.99939 7.49546 3.01715 7.41387 3.05162C7.33228 3.08609 7.25843 3.13656 7.19669 3.20007C7.07035 3.32864 6.99955 3.50168 6.99955 3.68194C6.99955 3.8622 7.07035 4.03525 7.19669 4.16382Z"
                                fill="#212529"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_655_1942">
                                <rect width="20" height="17.5" fill="white" transform="matrix(0 1 -1 0 18.25 0.5)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </section>
            {isModalOpen && <ModalForm onClose={() => setModalOpen(false)} />}
        </div>
    );
};

export default Reviews;
