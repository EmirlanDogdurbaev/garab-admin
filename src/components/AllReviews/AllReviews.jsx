import { FaEye, FaTrash, FaEyeSlash } from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {setPage} from "../../store/slices/paginationSlice.js";
import {useEffect, useState} from "react";
import styles from "./AllReviews.module.scss";
import {deleteReviewById, fetchReviewsAdmin} from "../../store/slices/reviewsSlice.js";
import {API_URI} from "../../store/api/api.js";
import axios from "axios";
const AllReviews = () => {
    const dispatch = useDispatch();
    const { currentPage, itemsPerPage2 } = useSelector((state) => state.pagination);
    const initialReviews = useSelector((state) => state.reviews.data); // Получение начального состояния из Redux

    const [reviews, setReviews] = useState(initialReviews); // Локальное состояние для обновления видимости
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "" });

    useEffect(() => {
        dispatch(fetchReviewsAdmin());
    }, [dispatch]);

    useEffect(() => {
        setReviews(initialReviews); // Синхронизация локального состояния с Redux
    }, [initialReviews]);

    const startIndex = (currentPage - 1) * itemsPerPage2;
    const endIndex = startIndex + itemsPerPage2;

    const totalPages = Math.ceil((reviews?.length || 0) / itemsPerPage2);
    const currentItems = reviews?.slice(startIndex, endIndex) || [];

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    const handleToggleVisibility = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${API_URI}/switchIsShowReview`,
                { id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                setReviews((prevReviews) =>
                    prevReviews.map((item) =>
                        item.id === id
                            ? { ...item, is_show: !item.is_show } // Инвертируем значение is_show
                            : item
                    )
                );
                setToast({ show: true, message: "Видимость отзыва успешно обновлена" });
                setTimeout(() => setToast({ show: false, message: "" }), 1000);
            } else {
                console.error("Ошибка ответа:", response.status, response.data);
            }
        } catch (error) {
            console.error("Ошибка запроса:", error.response?.status, error.response?.data);
        }
    };

    const handleOpenModal = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const handleCloseToast = () => {
        setToast({ show: false, message: "" });
    };

    return (
        <div className={styles.AllReviews}>
            <div className={styles.inner}>
                <h1 className={styles.titleMain} style={{ marginBottom: "20px" }}>
                    Все Отзывы
                </h1>

                <div className={styles.tableContainer}>
                    {reviews && reviews.length > 0 ? (
                        <table className={styles.customTable}>
                            <thead>
                            <tr>
                                <th>Содержимое</th>
                                <th>Пользователь</th>
                                <th>Рейтинг</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index}>
                                    <td className={styles.title}>{item.text}</td>
                                    <td>{item.username}</td>
                                    <td>{item.rating} звезд</td>
                                    <td>{item.is_show ? "Отображается" : "Скрыт"}</td>
                                    <td className={styles.actions}>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleToggleVisibility(item.id)}
                                        >
                                            {item.is_show ? <FaEye /> : <FaEyeSlash />}
                                        </button>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleOpenModal(item.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className={styles.noReviews}>Отзывы отсутствуют</p>
                    )}
                </div>

                {reviews && reviews.length > 0 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ←
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? styles.active : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
            {/* Модальное окно */}
            {showModal && (
                <div className={`${styles.modal} ${styles.show}`}>
                    <div className={styles.modalContent}>
                        <p>Вы уверены, что хотите удалить этот отзыв?</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleConfirmDelete} className={styles.confirmButton}>
                                Удалить
                            </button>
                            <button onClick={handleCloseModal} className={styles.cancelButton}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Тост уведомление */}
            {toast.show && (
                <div className={`${styles.toast}`}>
                    <p>{toast.message}</p>
                    <button onClick={handleCloseToast} className={styles.closeToast}>
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllReviews;
