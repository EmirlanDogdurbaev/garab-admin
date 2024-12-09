import styles from "./AddCategory.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../../store/slices/getCategories.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.categories);

    const [data, setData] = useState({
        ru: "",
        en: "",
        kgz: "",
    });

    const [modal, setModal] = useState({
        show: false,
        message: "",
        type: "", // success or error
    });

    const handleInputChange = (event, language) => {
        setData((prevData) => ({
            ...prevData,
            [language]: event.target.value,
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!data.ru.trim() || !data.en.trim() || !data.kgz.trim()) {
            setModal({ show: true, message: "Заполните все поля!", type: "error" });
            return;
        }

        const category_list = [
            { language_code: "ru", name: data.ru },
            { language_code: "en", name: data.en },
            { language_code: "kgz", name: data.kgz },
        ];

        try {
            await dispatch(createCategory(category_list)).unwrap();
            setModal({ show: true, message: "Категория успешно создана!", type: "success" });
        } catch (err) {
            setModal({ show: true, message: "Ошибка при создании категории. Попробуйте снова.", type: "error" });
        }
    };

    const handleCloseModal = () => {
        setModal({ show: false, message: "", type: "" });

        if (modal.type === "success") {
            // Перенаправление на список категорий
            navigate("/admin/all-category");
        }
    };

    return (
        <div className={styles.AddCategory}>
            <section>
                <h3>Создать категорию</h3>
            </section>
            <form onSubmit={handleFormSubmit}>
                <label>
                    <h5>Название категории (Русский)</h5>
                    <input
                        type="text"
                        placeholder="Введите название на русском"
                        value={data.ru}
                        onChange={(event) => handleInputChange(event, "ru")}
                        disabled={status === "loading"}
                    />
                </label>
                <label>
                    <h5>Название категории (English)</h5>
                    <input
                        type="text"
                        placeholder="Enter category name in English"
                        value={data.en}
                        onChange={(event) => handleInputChange(event, "en")}
                        disabled={status === "loading"}
                    />
                </label>
                <label>
                    <h5>Название категории (Кыргызча)</h5>
                    <input
                        type="text"
                        placeholder="Категорияны кыргызча жазыңыз"
                        value={data.kgz}
                        onChange={(event) => handleInputChange(event, "kgz")}
                        disabled={status === "loading"}
                    />
                </label>
                <button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Сохраняем..." : "Сохранить"}
                </button>
            </form>

            {/* Модальное окно */}
            {modal.show && (
                <div className={styles.modal}>
                    <div className={`${styles.modalContent} ${styles[modal.type]}`}>
                        <p>{modal.message}</p>
                        <button onClick={handleCloseModal} className={styles.modalButton}>
                            ОК
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCategory;
