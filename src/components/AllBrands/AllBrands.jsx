import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {deleteBrand, fetchBrands} from "../../store/slices/admin/brands/brands.js";
import styles from "./AllBrands.module.scss";
import {Link} from "react-router-dom";
import {setPage} from "../../store/slices/paginationSlice.js";

const AllBrands = () => {
    const dispatch = useDispatch();
    const all = useSelector((state) => state.brands.brands);
    const {currentPage, itemsPerPage} = useSelector((state) => state.pagination);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [selectedBrandId, setSelectedBrandId] = useState(null);

    const [successNotification, setSuccessNotification] = useState(false);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = all.slice(startIndex, endIndex);

    const totalPages = Math.ceil(all.length / itemsPerPage);

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    const handleDeleteConfirmation = (id) => {
        setSelectedBrandId(id);
        setModalMessage("Вы уверены, что хотите удалить клиента? Это действие нельзя отменить.");
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedBrandId) return;

        dispatch(deleteBrand(selectedBrandId))
            .unwrap()
            .then(() => {
                setSuccessNotification(true);
                setTimeout(() => setSuccessNotification(false), 3000);
                dispatch(fetchBrands());
            })
            .catch((error) => {
                console.error("Ошибка при удалении клиента:", error);
                alert(error.message || "Не удалось удалить клиента.");
            })
            .finally(() => {
                setShowDeleteModal(false);
                setSelectedBrandId(null);
            });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Клиенты</h1>
                <Link to={"/admin/create-brand"} className={styles.addButton}>+ Добавить новую карточку клиента</Link>
            </header>

            <div className={styles.grid}>
                {currentItems.map((brand) => (
                    <div key={brand.id} className={styles.card}>
                        <p>{brand.name}</p>
                        <div className={styles.actions}>
                            <Link to={`/admin/update-brand/${brand.id}`} className={styles.editButton}>
                                ✏️
                            </Link>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteConfirmation(brand.id)}
                            >
                                🗑️
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
                {Array.from({length: totalPages}, (_, index) => (
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

            {/* Модальное окно подтверждения удаления */}
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <p>{modalMessage}</p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className={styles.cancelButton}
                            >
                                Закрыть
                            </button>
                            <button
                                onClick={handleDelete}
                                className={styles.deleteButton}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Уведомление об успешном удалении */}
            {successNotification && (
                <div className={styles.notification}>
                    Клиент успешно удален
                    <button
                        onClick={() => setSuccessNotification(false)}
                        className={styles.closeNotification}
                    >
                        ✖
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllBrands;
