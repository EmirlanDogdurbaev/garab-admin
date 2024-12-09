import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../store/slices/paginationSlice.js";
import styles from "./AllCategory.module.scss";
import { useEffect, useState } from "react";
import { deleteCategory, fetchCategories } from "../../store/slices/getCategories.js";
import { Link } from "react-router-dom";

const AllCategory = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);

    const { currentPage, itemsPerPage } = useSelector((state) => state.pagination);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = categories.slice(startIndex, endIndex);

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const [modal, setModal] = useState({
        show: false,
        categoryId: null,
    });

    const [notification, setNotification] = useState({
        show: false,
        message: "",
    });

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const openModal = (id) => {
        setModal({ show: true, categoryId: id });
    };

    const closeModal = () => {
        setModal({ show: false, categoryId: null });
    };

    const confirmDelete = () => {
        dispatch(deleteCategory(modal.categoryId))
            .unwrap()
            .then(() => {
                setNotification({
                    show: true,
                    message: "Категория успешно удалена",
                });
                dispatch(fetchCategories());
            })
            .catch((error) => {
                console.error("Ошибка при удалении категории:", error);
                setNotification({
                    show: true,
                    message: "Не удалось удалить категорию",
                });
            })
            .finally(() => {
                closeModal();
                setTimeout(() => setNotification({ show: false, message: "" }), 3000);
            });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Категория</h1>
                <Link to={"/admin/add-category"} className={styles.addButton}>
                    + Добавить новую категорию
                </Link>
            </header>

            <div className={styles.grid}>
                {currentItems.map((category) => (
                    <div key={category.id} className={styles.card}>
                        <p>{category.name}</p>
                        <div className={styles.actions}>
                            <Link to={`/admin/update-category/${category.id}`} className={styles.editButton}>
                                <span>✏️</span>
                            </Link>
                            <button
                                className={styles.deleteButton}
                                onClick={() => openModal(category.id)}
                            >
                                <span>🗑️</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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

            {/* Модальное окно */}
            {modal.show && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <span className={styles.modalIcon}>⚠️</span>
                            <h3>Удалить категорию</h3>
                        </div>
                        <p>Вы уверены, что хотите удалить категорию? Это действие нельзя отменить.</p>
                        <div className={styles.modalActions}>
                            <button onClick={closeModal} className={styles.cancelButton}>
                                Закрыть
                            </button>
                            <button onClick={confirmDelete} className={styles.deleteButton}>
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Уведомление */}
            {notification.show && (
                <div className={styles.notification}>
                    <span>{notification.message}</span>
                    <button onClick={() => setNotification({ show: false, message: "" })}>×</button>
                </div>
            )}
        </div>
    );
};

export default AllCategory;
