import {useDispatch, useSelector} from "react-redux";
import {setPage} from "../../store/slices/paginationSlice.js";
import styles from "./AllCategory.module.scss";
import {useEffect} from "react";
import {deleteCategory, fetchCategories} from "../../store/slices/getCategories.js";
import {Link} from "react-router-dom";

const AllCategory = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);

    const {currentPage, itemsPerPage} = useSelector((state) => state.pagination);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = categories.slice(startIndex, endIndex);

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch]);

    console.log(currentItems)


    const handleDelete = (id) => {
        dispatch(deleteCategory(id))
            .unwrap()
            .then(() => {
                alert("Категория успешно удалена");
            })
            .catch((error) => {
                console.error("Ошибка при удалении коллекции:", error);
                alert(error.message || "Не удалось удалить коллекцию.");
            });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Категория</h1>
                <Link to={"/admin/add-category"} className={styles.addButton}>+ Добавить новую категорию</Link>
            </header>

            <div className={styles.grid}>
                {currentItems.map((category) => (
                    <div key={category.id} className={styles.card}>
                        <p>{category.name}</p>
                        <div className={styles.actions}>
                            <Link to={`/admin/update-category/${category.id}`} className={styles.editButton} >
                                <span>✏️</span>
                            </Link>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(category.id)}
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

        </div>
    )
}

export default AllCategory;