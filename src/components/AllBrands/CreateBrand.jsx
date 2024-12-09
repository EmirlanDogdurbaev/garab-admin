import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrand } from "../../store/slices/admin/brands/brands.js";
import { useNavigate } from "react-router-dom";
import styles from "./CreateBrand.module.scss";

const CreateBrand = () => {
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null); // Для предпросмотра
    const [modal, setModal] = useState({ show: false, message: "", type: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.brands);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setModal({ show: true, message: "Введите имя бренда!", type: "error" });
            return;
        }



        dispatch(createBrand({name, photo}))
            .unwrap()
            .then(() => {
                setModal({ show: true, message: "Бренд успешно создан!", type: "success" });
                setTimeout(() => {
                    setModal({ show: false, message: "", type: "" });
                    navigate("/admin/brands");
                }, 3000);
            })
            .catch(() => {
                setModal({ show: true, message: "Ошибка при создании бренда!", type: "error" });
                setTimeout(() => setModal({ show: false, message: "", type: "" }), 3000);
            });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file)); // Устанавливаем URL для предпросмотра
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label>Имя бренда:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Введите имя бренда"
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label>Фото бренда:</label>
                    <div className={styles.photoContainer}>
                        {preview ? (
                            <img
                                src={preview}
                                alt="Предпросмотр"
                                className={styles.photoPreview}
                            />
                        ) : (
                            <div className={styles.photoPlaceholder}>Загрузите фото</div>
                        )}

                    </div>
                    <input
                        type="file"
                        onChange={handlePhotoChange}
                        required
                        className={styles.fileInput}
                    />
                </div>
                <div className={styles.buttons}>
                    <button type="submit" disabled={loading} className={styles.submitButton}>
                        {loading ? "Создание..." : "Создать"}
                    </button>
                </div>
            </form>

            {modal.show && (
                <div className={`${styles.modal} ${modal.type === "success" ? styles.success : styles.error}`}>
                    <p>{modal.message}</p>
                    {modal.type === "error" && (
                        <button onClick={() => setModal({ show: false, message: "", type: "" })}>
                            Закрыть
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CreateBrand;
