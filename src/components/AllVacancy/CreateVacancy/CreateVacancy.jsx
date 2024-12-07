import {useDispatch} from "react-redux";
import {useState} from "react";
import {createVacancy} from "../../../store/slices/getVacancy.js";
import styles from "./CreateVacancy.module.scss";

const CreateVacancy = () => {
    const dispatch = useDispatch();

    // Инициализация данных для каждого языка
    const [data, setData] = useState({
            "salary": 0,
            "isActive": true,
            "vacancy": [
                {
                    "language_code": "en",
                    "title": " ",
                    "requirements": [""],
                    "responsibilities": [""],
                    "conditions": [""],
                    "information": [""]
                },
                {
                    "language_code": "ru",
                    "title": "",
                    "requirements": [""],
                    "responsibilities": [""],
                    "conditions": [""],
                    "information": [""]
                },
                {
                    "language_code": "kgz",
                    "title": "",
                    "requirements": [""],
                    "responsibilities": [""],
                    "conditions": [""],
                    "information": [""]
                }
            ]
        }
    );

    // Обработчик для изменения данных в массиве `vacancy` по языку
    const handleChange = (e, language, field, index = null) => {
        const value = e.target.value;

        setData((prevData) => ({
            ...prevData,
            vacancy: prevData.vacancy.map((v) =>
                v.language_code === language
                    ? {
                        ...v,
                        [field]: index !== null
                            ? v[field].map((item, i) => (i === index ? value : item))
                            : value,
                    }
                    : v
            ),
        }));
    };

    // Добавить новую строку в массив (например, для "requirements")
    const handleAddItem = (language, field) => {
        setData((prevData) => ({
            ...prevData,
            vacancy: prevData.vacancy.map((v) =>
                v.language_code === language
                    ? {...v, [field]: [...v[field], ""]}
                    : v
            ),
        }));
    };

    // Удалить строку из массива
    const handleRemoveItem = (language, field, index) => {
        setData((prevData) => ({
            ...prevData,
            vacancy: prevData.vacancy.map((v) =>
                v.language_code === language
                    ? {...v, [field]: v[field].filter((_, i) => i !== index)}
                    : v
            ),
        }));
    };

    // Обработчик изменения зарплаты
    const handleSalaryChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            salary: e.target.value,
        }));
    };

    // Отправка данных
    const handleSubmit = (e) => {
        e.preventDefault();

        // Приведение зарплаты к числу и удаление пустых строк
        const formattedData = {
            ...data,
            salary: Number(data.salary),
            vacancy: data.vacancy.map((v) => ({
                ...v,
                requirements: v.requirements.filter((req) => req.trim() !== ""),
                responsibilities: v.responsibilities.filter((resp) => resp.trim() !== ""),
                conditions: v.conditions.filter((cond) => cond.trim() !== ""),
                information: v.information.filter((info) => info.trim() !== ""),
            })),
        };

        console.log("Данные перед отправкой:", formattedData);

        dispatch(createVacancy(formattedData))
            .unwrap()
            .then((response) => {
                console.log("Vacancy created successfully:", response);
            })
            .catch((error) => {
                console.error("Failed to create vacancy:", error);
            });
    };

    return (
        <div className={styles.container}>
            <h2>Добавить новую вакансию</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.cont}>
                    <h4>Зарплата:</h4>
                    <input
                        type="number"
                        value={data.salary}
                        onChange={handleSalaryChange}
                        className={styles.input}
                    />
                </div>

                {data.vacancy.map((langData) => (
                    <section key={langData.language_code} className={styles.section}>
                        <h3>
                            {langData.language_code === "en"
                                ? "English"
                                : langData.language_code === "ru"
                                    ? "Русский"
                                    : langData.language_code === "kgz" ? "Кыргызча" : null}
                        </h3>

                        <div className={styles.cont}>
                            <label>Должность:</label>
                            <input
                                type="text"
                                value={langData.title}
                                onChange={(e) =>
                                    handleChange(e, langData.language_code, "title")
                                }
                                className={styles.input}
                            />
                        </div>

                        {["requirements", "responsibilities", "conditions", "information"].map((field) => (
                            <div key={field} className={styles.fieldGroup}>
                                <label>
                                    {field === "requirements"
                                        ? "Требования"
                                        : field === "responsibilities"
                                            ? "Обязанности"
                                            : field === "conditions"
                                                ? "Условия"
                                                : "Информация"}
                                </label>
                                {langData[field].map((item, index) => (
                                    <div key={index} className={styles.fieldRow}>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) =>
                                                handleChange(e, langData.language_code, field, index)
                                            }
                                            className={styles.input}
                                        />
                                        <button

                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(
                                                    langData.language_code,
                                                    field,
                                                    index
                                                )
                                            }
                                            className={styles.button_delete}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddItem(langData.language_code, field)
                                    }
                                    className={`${styles.button} ${styles.addBtn}`}
                                >
                                    Добавить {field === "requirements" ? "требование" : "пункт"}
                                </button>
                            </div>
                        ))}
                    </section>
                ))}

                <div>
                    <button type="submit" className={styles.button}>
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateVacancy;
