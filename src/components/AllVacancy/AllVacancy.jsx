import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../store/slices/paginationSlice.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteVacancyById, fetchVacancies } from "../../store/slices/getVacancy.js";
import styles from "./AllVacancy.module.scss";
import {toggle} from "../../store/slices/reviewsSlice.js";

const AllVacancy = () => {
    const dispatch = useDispatch();
    const { currentPage, itemsPerPage2 } = useSelector((state) => state.pagination);
    const { vacancies } = useSelector((state) => state.vacancies);

    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [toast, setToast] = useState({ show: false, message: "" });

    useEffect(() => {
        dispatch(fetchVacancies());
    }, [dispatch]);



    const startIndex = (currentPage - 1) * itemsPerPage2;
    const endIndex = startIndex + itemsPerPage2;

    const totalPages = Math.ceil((vacancies?.length || 0) / itemsPerPage2);
    const currentItems = vacancies?.slice(startIndex, endIndex) || [];

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    const handleOpenModal = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            dispatch(deleteVacancyById(deleteId))
                .unwrap()
                .then(() => {
                    setToast({ show: true, message: "Вакансия успешно удалена" });
                    setTimeout(() => setToast({ show: false, message: "" }), 3000);
                })
                .catch((error) => {
                    console.error("Ошибка при удалении Вакансии:", error);
                });
        }
        setShowModal(false);
        setDeleteId(null);
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const handleCloseToast = () => {
        setToast({ show: false, message: "" });
    };

    return (
        <div className={styles.AllVacancy}>
            <div className={styles.inner}>
                <h1 className={styles.titleMain} style={{ marginBottom: "20px " }}>
                    Все вакансии
                </h1>
                <section className={styles.search}>
                    <button className={styles.add_btn}>
                        <Link to={"/admin/create-vacancy"} style={{ color: "white" }}>
                            Добавить новую вакансию
                        </Link>
                    </button>
                </section>

                <div className={styles.tableContainer}>
                    {vacancies && vacancies.length > 0 ? (
                        <table className={styles.customTable}>
                            <thead>
                            <tr>
                                <th>Должность</th>
                                <th>Заработная плата</th>
                                <th></th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index}>
                                    <td className={styles.title}>{item.title}</td>
                                    <td>{item.salary} сом</td>
                                    <td></td>
                                    <td className={styles.actions}>
                                        <Link className={styles.actionButton} to={`/admin/change-vacancy/${item.id}`}>
                                            <FaEdit />
                                        </Link>
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
                        <p className={styles.noVacancies}>Вакансий нет</p>
                    )}
                </div>

                {vacancies && vacancies.length > 0 && (
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
                        <p>Вы уверены, что хотите удалить эту вакансию?</p>
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

export default AllVacancy;
