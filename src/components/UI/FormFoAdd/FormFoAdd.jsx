import {useState} from "react";
import axios from "axios";
import styles from "./FormFoAdd.module.scss";
import {API_URI} from "../../../store/api/api.js";
import {useNavigate} from "react-router-dom";

const FormFoAdd = () => {
    const [formState, setFormState] = useState({
        isProducer: true,
        isAqua: false,
        isGarant: false,
        isPainted: false,
        isPopular: true,
        isNew: true,
        collections: [
            {name: "", description: "", language_code: "ru"},
            {name: "", description: "", language_code: "kgz"},
            {name: "", description: "", language_code: "en"},
        ],
    });
    const navigate = useNavigate();

    const [modalVisible, setModalVisible] = useState(false);

    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);

    const handleFormChange = (field, value) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleExclusiveToggle = (field) => {
        setFormState((prev) => ({
            ...prev,
            isProducer: false,
            isAqua: false,
            isGarant: false,
            [field]: true,
        }));
    };

    const handleCollectionChange = (index, field, value) => {
        const updatedCollections = [...formState.collections];
        updatedCollections[index][field] = value;
        setFormState({...formState, collections: updatedCollections});
    };

    const handleAddPhoto = () => {
        setPhotos((prevPhotos) => [
            ...prevPhotos,
            {file: null, isMain: false, hashColor: "#ffffff"},
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
                isProducer: formState.isProducer,
                isAqua: formState.isAqua,
                isGarant: formState.isGarant,
                isPainted: formState.isPainted,
                isPopular: formState.isPopular,
                isNew: formState.isNew,
                collections: formState.collections,
            })
        );

        photos.forEach((photo) => {
            if (photo.file) {
                formData.append(`photos`, photo.file);
                formData.append(`isMain_${photo.file.name}`, photo.isMain);
                formData.append(`hashColor_${photo.file.name}`, photo.hashColor);
            }
        });

        // Логируем данные FormData перед отправкой
        console.log("Данные, отправляемые на бэкэнд:");
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        try {
            const response = await axios.post(`${API_URI}/collection`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });

            console.log("Ответ от сервера:", response.data);
            setModalVisible(true);
            setFormState({
                price: 0,
                isProducer: true,
                isAqua: false,
                isGarant: false,
                isPainted: false,
                isPopular: true,
                isNew: true,
                collections: [
                    {name: "", description: "", language_code: "ru"},
                    {name: "", description: "", language_code: "kgz"},
                    {name: "", description: "", language_code: "en"},
                ],
            });

            setPhotos([]);

            setTimeout(() => {
                setModalVisible(false);
                navigate("/admin/all-collections");
            }, 3000);
        } catch (err) {
            console.error("Ошибка при отправке данных:", err.response?.data || err.message);
            setError(err.response?.data || "Произошла ошибка при создании коллекции.");
        }
    };


    return (
        <main className={styles.Form}>
            <form onSubmit={handleSubmit}>

                {formState.collections.map((collection, index) => (
                    <section key={index} className={styles.info_container}>
                        <h4>
                            {collection.language_code === "ru"
                                ? "Русский"
                                : collection.language_code === "kgz"
                                    ? "Кыргызча"
                                    : "English"}
                        </h4>
                        <span>
              <label>
                <h5>
                  {collection.language_code === "ru"
                      ? "Название коллекции"
                      : collection.language_code === "kgz"
                          ? "Коллекциянын аты"
                          : "Collection Name"}
                </h5>
                <input
                    type="text"
                    placeholder="Название"
                    value={collection.name}
                    onChange={(e) =>
                        handleCollectionChange(index, "name", e.target.value)
                    }
                />
              </label>

            </span>
                        <label htmlFor="" className={styles.textarea}>
                            <h5>
                                {collection.language_code === "ru"
                                    ? "Описание"
                                    : collection.language_code === "kgz"
                                        ? "Суроттомо"
                                        : "Description"}
                            </h5>
                            <textarea
                                cols="180"
                                rows="10"
                                required
                                placeholder="Описание коллекции"
                                value={collection.description}
                                onChange={(e) =>
                                    handleCollectionChange(index, "description", e.target.value)
                                }
                            />
                        </label>
                    </section>
                ))}

                <div className={styles.filters}>
                    <div className={styles.group}>
                        <h5>Тип продукта</h5>
                        <label>
                            <input
                                type="radio"
                                name="exclusive"
                                value="isProducer"
                                checked={formState.isProducer}
                                onChange={() => handleExclusiveToggle("isProducer")}
                            />
                            Производитель
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="exclusive"
                                value="isAqua"
                                checked={formState.isAqua}
                                onChange={() => handleExclusiveToggle("isAqua")}
                            />
                            Водный
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="exclusive"
                                value="isGarant"
                                checked={formState.isGarant}
                                onChange={() => handleExclusiveToggle("isGarant")}
                            />
                            Гарантированный
                        </label>
                    </div>

                    <div className={styles.group}>
                        <h5>Отделка</h5>
                        <label>
                            <input
                                type="radio"
                                name="isPainted"
                                value={true}
                                checked={formState.isPainted === true}
                                onChange={() => handleFormChange("isPainted", true)}
                            />
                            Крашеная
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="isPainted"
                                value={false}
                                checked={formState.isPainted === false}
                                onChange={() => handleFormChange("isPainted", false)}
                            />
                            Не крашеная
                        </label>
                    </div>

                    <div className={styles.group}>
                        <h5>Дополнительно</h5>
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
                </div>

                <div className={styles.photos}>
                    <p>Фотографии</p>
                    <div className={styles.grid}>
                        {photos.map((photo, index) => (
                            <div key={index} className={styles.cardWrapper}>
                                <div className={styles.card} style={{height: "300px", width: "300px"}}>
                                    {photo.file ? (
                                        <img
                                            src={URL.createObjectURL(photo.file)}
                                            alt={`Фото ${index + 1}`}
                                        />
                                    ) : (
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
                                            onChange={() =>
                                                handlePhotoFieldChange(index, "isMain", true)
                                            }
                                        />
                                        Главная
                                    </label>
                                    <input
                                        type="color"
                                        value={photo.hashColor}
                                        onChange={(e) =>
                                            handlePhotoFieldChange(index, "hashColor", e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(index)}
                                    >
                                        Удалить
                                    </button>
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

            {modalVisible && (
                <div className={styles.successModal}>
                    <p>Коллекция успешно добавлена</p>
                </div>
            )}
        </main>
    );
};

export default FormFoAdd;
