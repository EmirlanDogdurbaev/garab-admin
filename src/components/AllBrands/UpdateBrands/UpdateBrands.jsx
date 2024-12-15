import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {fetchBrandsById, updateBrand} from "../../../store/slices/admin/brands/brands.js";
import styles from "./UpdateBrands.module.scss";

const UpdateBrand = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {loading, error} = useSelector((state) => state.brands);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchBrandsById(id))
                .unwrap()
                .then((fetchedBrand) => {
                    setName(fetchedBrand.name || "");
                    setPreview(fetchedBrand.photo || null);
                })
                .catch((err) => console.error("Ошибка загрузки бренда:", err));
        }
    }, [id, dispatch]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
        setPreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Введите имя бренда");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());

        if (photo) {
            formData.append("photo", photo);
        }

        dispatch(updateBrand({brandId: id, formData}))
            .unwrap()
            .then(() => {
                alert("Бренд успешно обновлен!");
                navigate("/admin/brands");
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
                        <section className={styles.photo_cont}>
                            <div className={styles.photoPreviewContainer}>
                                <img src={preview} alt="Preview" className={styles.photoPreview}/>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className={styles.removePhotoButton}
                            >
                                Удалить
                            </button>
                        </section>
                    ) : (
                        <div className={styles.photoPlaceholder}>
                            <input
                                id="photoInput"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={{display: "none"}}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById("photoInput").click()}
                                className={styles.addPhotoButton}
                            >
                                <svg width="81" height="81" viewBox="0 0 81 81" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M40.5 67.5V40.5M40.5 40.5V13.5M40.5 40.5H67.5M40.5 40.5H13.5"
                                          stroke="black" strokeWidth="1" strokeLinecap="none"/>
                                </svg>

                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.buttons}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => window.history.back()}
                >
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
