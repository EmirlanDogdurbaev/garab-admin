import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBrandsById, updateBrand } from "../../../store/slices/admin/brands/brands.js";
import styles from "./UpdateBrands.module.scss";

const UpdateBrand = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.brands);

    const [name, setName] = useState(""); // Убедимся, что `name` имеет значение по умолчанию
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        dispatch(fetchBrandsById(id))
            .unwrap()
            .then((brand) => {
                setName(brand?.name || ""); // Убедимся, что `name` существует
                setPreview(brand?.photo || null); // Убедимся, что `photo` существует
            })
            .catch((err) => console.error("Ошибка загрузки бренда:", err));
    }, [id, dispatch]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file)); // Предпросмотр загруженного файла
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Введите имя бренда");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        if (photo) {
            formData.append("photo", photo);
        }

        dispatch(updateBrand({ brandId: id, formData }))
            .unwrap()
            .then(() => {
                alert("Бренд успешно обновлен!");
            })
            .catch((err) => {
                console.error("Ошибка обновления бренда:", err);
                alert("Не удалось обновить бренд.");
            });
    };

    if (loading && !name) return <p>Загрузка...</p>;

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div className={styles.field}>
                <label htmlFor="name">Имя клиента</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Имя клиента"
                />
                {!name.trim() && <span className={styles.validation}>*Введите имя клиента</span>}
            </div>
            <div className={styles.field}>
                <label>Логотип</label>
                <div className={styles.photo}>
                    {preview ? (
                        <img src={preview} alt="Preview" className={styles.photoPreview} />
                    ) : (
                        <div className={styles.photoPlaceholder}>
                            <input type="file" accept="image/*" onChange={handlePhotoChange} />
                            <span className={styles.photoIcon}>+</span>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.buttons}>
                <button type="button" className={styles.cancelButton} onClick={() => window.history.back()}>
                    Закрыть
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Обновление..." : "Сохранить"}
                </button>
            </div>
            {error && <p className={styles.error}>Ошибка: {error}</p>}
        </form>
    );
};

export default UpdateBrand;
