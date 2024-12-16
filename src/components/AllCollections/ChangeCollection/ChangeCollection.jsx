import styles from "./ChangeCollection.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URI } from "../../../store/api/api.js";
import {useNavigate, useParams} from "react-router-dom";

const API_URL = "http://localhost:8080";

const ChangeCollection = () => {
    const { id } = useParams();
    const [photos, setPhotos] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({show: false, message: "", type: ""}); // Для модального окна

    const [formState, setFormState] = useState({
        price: 0,
        isProducer: true,
        isPainted: false,
        isPopular: false,
        isNew: false,
        category_id: null,
        collections: [
            { name: "", description: "", language_code: "ru" },
            { name: "", description: "", language_code: "en" },
            { name: "", description: "", language_code: "kgz" },
        ],
    });

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(
                    `${API_URI}/getCollectionById?collection_id=${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const productData = response.data;

                setFormState({
                    price: productData.price || 0,
                    isProducer: productData.isProducer || true,
                    isPainted: productData.isPainted || false,
                    isPopular: productData.is_popular || false,
                    isNew: productData.is_new || false,
                    category_id: productData.category_id || null,
                    collections: productData.collections || [
                        { name: "", description: "", language_code: "ru" },
                        { name: "", description: "", language_code: "en" },
                        { name: "", description: "", language_code: "kgz" },
                    ],
                });

                setPhotos(
                    (productData.photos || []).map((photo) => ({
                        file: null,
                        isMain: photo.isMain,
                        hashColor: photo.hashColor,
                        url: photo.url,
                    }))
                );

                setLoading(false);
            } catch (err) {
                setError("Ошибка загрузки данных коллекции.");
                console.error(err);
            }
        };

        fetchProductData();
    }, [id]);

    const handleFormChange = (field, value) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCollectionChange = (index, field, value) => {
        const updatedCollections = [...formState.collections];
        updatedCollections[index][field] = value;
        setFormState((prev) => ({
            ...prev,
            collections: updatedCollections,
        }));
    };

    const handleFileReplace = (index) => {
        const updatedPhotos = [...photos];
        updatedPhotos[index].file = null; // Удаляем текущий файл
        updatedPhotos[index].url = null; // Удаляем серверное фото
        setPhotos(updatedPhotos); // Обновляем состояние
    };


    const handleAddPhoto = () => {
        setPhotos((prevPhotos) => [
            ...prevPhotos,
            { file: null, isMain: false, hashColor: "#ffffff", url: null },
        ]);
    };

    const handleFileChange = (index, file) => {
        const updatedPhotos = [...photos];
        const fileName = file.name;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
        const baseName = fileName.substring(0, fileName.lastIndexOf('.'));


        let newFileName = fileName;
        let counter = 1;

        while (updatedPhotos.some(photo => photo.file?.name === newFileName)) {
            newFileName = `${baseName}_${counter}${fileExtension}`;
            counter++;
        }

        const renamedFile = new File([file], newFileName, {type: file.type});
        updatedPhotos[index].file = renamedFile;
        setPhotos(updatedPhotos);
    };


    const handlePhotoFieldChange = (index, field, value) => {
        const updatedPhotos = [...photos];
        updatedPhotos[index][field] = value;
        setPhotos(updatedPhotos);
    };

    const handleRemovePhoto = (index) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append(
            "collection",
            JSON.stringify({
                price: formState.price,
                isProducer: formState.isProducer,
                isPainted: formState.isPainted,
                is_popular: formState.isPopular,
                is_new: formState.isNew,
                collections: formState.collections,
                category_id: formState.category_id,
            })
        );

        photos.forEach((photo) => {
            console.log(photo)
            formData.append(`photos`, photo.file);
            formData.append(`isMain_${photo.file.name}`, photo.isMain);
            formData.append(`hashColor_${photo.file.name}`, photo.hashColor);
        });

        try {
            const response = await axios.put(`${API_URI}/collection?collection_id=${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setModal({show: true, message: "Товар успешно обновлён", type: "success"});
            navigate("/admin/all-collections");
        } catch (err) {
            setError(err.response?.data || "Ошибка при обновлении коллекции.");
            console.error("Ошибка:", err);
        }
    };



    if (loading) return <p>Загрузка...</p>;

    const closeModal = () => {
        setModal({show: false, message: "", type: ""});
    };

    return (
        <div className={styles.UpdateProducts}>
            <h2>Коллекции / Изменить коллекцию (ID: {id})</h2>
            <form onSubmit={handleSubmit}>

                {formState.collections.map((item, index) => (
                    <section key={index} className={styles.info_container}>
                        <h4>
                            {item.language_code === "ru"
                                ? "Русский"
                                : item.language_code === "kgz"
                                    ? "Кыргызча"
                                    : "English"}
                        </h4>
                        <label>
                            <h5>Название</h5>
                            <input
                                type="text"
                                placeholder="Название"
                                value={item.name}
                                onChange={(e) =>
                                    handleCollectionChange(index, "name", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            <h5>Описание</h5>
                            <textarea
                                placeholder="Описание"
                                value={item.description}
                                onChange={(e) =>
                                    handleCollectionChange(index, "description", e.target.value)
                                }
                            />
                        </label>
                    </section>
                ))}

                <div className={styles.filters}>
                    <label>
                        <input
                            type="checkbox"
                            checked={formState.isPopular}
                            onChange={() =>
                                handleFormChange("isPopular", !formState.isPopular)
                            }
                        />
                        Популярный товар
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={formState.isNew}
                            onChange={() => handleFormChange("isNew", !formState.isNew)}
                        />
                        Новый товар (новинка)
                    </label>
                </div>

                <div className={styles.photos}>
                    <p>Фотографии</p>
                    <div className={styles.grid}>

                        {Array.isArray(photos) && photos.map((photo, index) => (
                            <div key={index} className={styles.cardWrapper}>
                                <div className={styles.card} style={{height: "300px", width: "300px"}}>
                                    {photo.file ? (
                                        // Отображение локального файла
                                        <img
                                            src={URL.createObjectURL(photo.file)}
                                            alt={`Фото ${index + 1}`}
                                        />
                                    ) : photo.url ? (
                                        // Отображение фото с сервера
                                        <img
                                            src={`${API_URL}${photo.url}`}
                                            alt={`Фото ${index + 1}`}
                                        />
                                    ) : (
                                        // Поле загрузки файла
                                        <input
                                            style={{height: "300px", width: "300px"}}
                                            type="file"
                                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                                        />
                                    )}
                                </div>
                                <div className={styles.colors}>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`main-photo`}
                                            checked={photo.isMain}
                                            onChange={() => handlePhotoFieldChange(index, "isMain", true)}
                                        />
                                        Главная
                                    </label>
                                    <input
                                        type="color"
                                        value={photo.hashColor}
                                        onChange={(e) => handlePhotoFieldChange(index, "hashColor", e.target.value)}
                                    />
                                    <div className={styles.buttons}>
                                        <button
                                            type="button"
                                            onClick={() => handleFileReplace(index)}
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePhoto(index)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}


                        <button type="button" onClick={handleAddPhoto} style={{height: "300px", width: "300px"}}>
                            Добавить фото
                        </button>
                    </div>
                </div>


                <button type="submit" className={styles.saveButton}>
                    Сохранить
                </button>
                {error && <p style={{color: "red"}}>{error}</p>}
            </form>

            {modal.show && (
                <div className={styles.modal}>
                    <div
                        className={`${styles.modalContent} ${modal.type === "success" ? styles.success : styles.error}`}>
                        <h4>{modal.message}</h4>
                        <button onClick={closeModal} className={styles.closeButton}>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangeCollection;
