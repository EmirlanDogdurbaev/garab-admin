import { useState } from "react";
import { useDispatch } from "react-redux";
import { createVacancy } from "../../../store/slices/getVacancy.js";
import { useNavigate } from "react-router-dom";
import styles from "./CreateVacancy.module.scss";

const CreateVacancy = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({
        salary: 0,
        isActive: true,
        vacancy: [
            {
                language_code: "en",
                title: "",
                requirements: [""],
                responsibilities: [""],
                conditions: [""],
                information: [""],
            },
            {
                language_code: "ru",
                title: "",
                requirements: [""],
                responsibilities: [""],
                conditions: [""],
                information: [""],
            },
            {
                language_code: "kgz",
                title: "",
                requirements: [""],
                responsibilities: [""],
                conditions: [""],
                information: [""],
            },
        ],
    });

    const [modal, setModal] = useState({ show: false, message: "", type: "", actions: null });

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

    const handleAddItem = (language, field) => {
        setData((prevData) => ({
            ...prevData,
            vacancy: prevData.vacancy.map((v) =>
                v.language_code === language
                    ? { ...v, [field]: [...v[field], ""] }
                    : v
            ),
        }));
    };

    const handleRemoveItem = (language, field, index) => {
        setData((prevData) => ({
            ...prevData,
            vacancy: prevData.vacancy.map((v) =>
                v.language_code === language
                    ? { ...v, [field]: v[field].filter((_, i) => i !== index) }
                    : v
            ),
        }));
    };

    const handleSalaryChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            salary: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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

        dispatch(createVacancy(formattedData))
            .unwrap()
            .then(() => {
                setModal({
                    show: true,
                    message: "Вакансия успешно создана!",
                    type: "success",
                    actions: (
                        <>
                            <button onClick={() => navigate("/admin/all-vacancies")}>
                                Вернуться на главный экран
                            </button>
                            <button
                                onClick={() => {
                                    setModal({ show: false, message: "", type: "", actions: null });
                                    setData({
                                        salary: 0,
                                        isActive: true,
                                        vacancy: [
                                            {
                                                language_code: "en",
                                                title: "",
                                                requirements: [""],
                                                responsibilities: [""],
                                                conditions: [""],
                                                information: [""],
                                            },
                                            {
                                                language_code: "ru",
                                                title: "",
                                                requirements: [""],
                                                responsibilities: [""],
                                                conditions: [""],
                                                information: [""],
                                            },
                                            {
                                                language_code: "kgz",
                                                title: "",
                                                requirements: [""],
                                                responsibilities: [""],
                                                conditions: [""],
                                                information: [""],
                                            },
                                        ],
                                    });
                                }}
                            >
                                Создать еще
                            </button>
                        </>
                    ),
                });
            })
            .catch(() => {
                setModal({
                    show: true,
                    message: "Ошибка при создании вакансии!",
                    type: "error",
                    actions: (
                        <button
                            onClick={() =>
                                setModal({ show: false, message: "", type: "", actions: null })
                            }
                        >
                            Закрыть
                        </button>
                    ),
                });
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
                                    : "Кыргызча"}
                        </h3>

                        <div className={styles.cont}>
                            <label>Должность:</label>
                            <input
                                type="text"
                                value={langData.title}
                                onChange={(e) => handleChange(e, langData.language_code, "title")}
                                className={styles.input}
                            />
                        </div>

                        {["requirements", "responsibilities", "conditions", "information"].map(
                            (field) => (
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
                                                    handleChange(
                                                        e,
                                                        langData.language_code,
                                                        field,
                                                        index
                                                    )
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
                                        Добавить
                                    </button>
                                </div>
                            )
                        )}
                    </section>
                ))}

                <div>
                    <button type="submit" className={styles.button}>
                        Сохранить
                    </button>
                </div>
            </form>

            {modal.show && (
                <div
                    className={`${styles.modal} ${
                        modal.type === "success" ? styles.success : styles.error
                    }`}
                >
                    <p>{modal.message}</p>
                    <div className={styles.modalActions}>{modal.actions}</div>
                </div>
            )}
        </div>
    );
};

export default CreateVacancy;
