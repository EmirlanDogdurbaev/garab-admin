import {useEffect, useState} from "react";
import {fetchVacancyById, updateVacancy} from "../../../store/slices/getVacancy.js";
import {useDispatch} from "react-redux";
import {Link, useParams} from "react-router-dom";
import styles from "./EditVacancy.module.scss";
const EditVacancy = () => {

    const {id} = useParams();
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchVacancyById(id))
                .unwrap()
                .then((response) => {
                    setData(response);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to fetch vacancy:", error);
                    setError("Ошибка загрузки вакансии. Попробуйте позже.");
                    setLoading(false);
                });
        }
    }, [id, dispatch]);

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
                    ? {...v, [field]: [...v[field], ""]}
                    : v
            ),
        }));
    };

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

    const handleSalaryChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            salary: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.vacancy.every((v) => v.title.trim() !== "")) {
            alert("Убедитесь, что все названия должностей заполнены.");
            return;
        }

        const formattedData = {
            id: Number(id),
            salary: Number(data.salary),
            vacancy: data.vacancy.map((v) => ({
                language_code: v.language_code,
                title: v.title.trim(),
                requirements: v.requirements.filter((req) => req.trim() !== ""),
                responsibilities: v.responsibilities.filter((resp) => resp.trim() !== ""),
                conditions: v.conditions.filter((cond) => cond.trim() !== ""),
                information: v.information.filter((info) => info.trim() !== ""),
            })),
        };

        console.log("Данные перед отправкой:", formattedData);

        dispatch(updateVacancy({data: formattedData}))
            .unwrap()
            .then(() => {
                alert("Vacancy updated successfully!");

            })
            .catch((error) => {
                console.error("Ошибка при обновлении вакансии:", error);
            });
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (

        <div className={styles.container}>
            <h2>Редактировать вакансию</h2>
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

                {data.vacancy?.map((langData) => (
                    <section key={langData.language_code} className={styles.section}>
                        <h3>
                            {langData.language_code === "en"
                                ? "English"
                                : langData.language_code === "ru"
                                    ? "Русский"
                                    : langData.language_code === "kgz"
                                        ? "Кыргызча"
                                        : null}
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

                    <Link to={"/admin/all-vacancies"} className={styles.back}>Вернуться назад </Link>
                </div>
            </form>
        </div>
    );
};

export default EditVacancy;