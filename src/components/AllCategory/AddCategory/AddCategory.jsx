import styles from "./AddCategory.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../../store/slices/getCategories.js";
import { useState } from "react";

const AddCategory = () => {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.categories);

    const [data, setData] = useState({
        ru: "",
        en: "",
        kgz: "",
    });

    const handleInputChange = (event, language) => {
        setData((prevData) => ({
            ...prevData,
            [language]: event.target.value,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (!data.ru.trim() || !data.en.trim() || !data.kgz.trim()) {
            alert("Заполните все поля!");
            return;
        }

        const category_list = [
            { language_code: "ru", name: data.ru },
            { language_code: "en", name: data.en },
            { language_code: "kgz", name: data.kgz },
        ];

        dispatch(createCategory(category_list));
        setData({ ru: "", en: "", kgz: "" });
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
                {error && <p className={styles.error}>Ошибка: {error}</p>}
            </form>
        </div>
    );
};

export default AddCategory;
