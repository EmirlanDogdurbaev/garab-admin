import {useState} from "react";
import axios from "axios";
import styles from "./FormFoAdd.module.scss";
import {API_URI} from "../../../store/api/api.js";

const FormFoAdd = () => {
    const [formState, setFormState] = useState({
        price: 1500.75,
        isProducer: true,
        isPainted: false,
        isPopular: true,
        isNew: true,
        collections: [
            {name: "", description: "", language_code: "ru"},
            {name: "", description: "", language_code: "kgz"},
            {name: "", description: "", language_code: "en"},
        ],
    });

    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);

    const handleFormChange = (field, value) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
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
        updatedPhotos[index].file = file;
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
                isPopular: formState.isPopular,
                isNew: formState.isNew,
                collections: formState.collections,
            })
        );

        const currentPhotos = [...photos];

        currentPhotos.forEach((photo, index) => {
            if (photo.file && photo.isMain !== null && photo.hashColor !== "") {

                formData.append(`photos`, photo.file);
                formData.append(`isMain_${photo.file.name}`, photo.isMain);
                formData.append(`hashColor_${photo.file.name}`, photo.hashColor);
            } else {
                console.log(`Skipping photo with index ${index} due to missing data`);
            }
        });

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        console.table(formData)

        try {
            const response = await axios.post(`${API_URI}/collection`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Success:", response.data);
        } catch (error) {
            setError(error.response?.data || error.message);
            console.error("Error:", error);
        }
    };



    return (
        <main className={styles.Form}>
            <form onSubmit={handleSubmit}>
                <section className={styles.title}>
                    <h2>Коллекции / Создать новую коллекцию</h2>
                    <div className={styles.line}></div>
                </section>

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
              <label>
                <h5>
                  {collection.language_code === "ru"
                      ? "Цена"
                      : collection.language_code === "kgz"
                          ? "Баасы"
                          : "Price"}
                </h5>
                <input
                    type="number"
                    placeholder="xxx"
                    value={formState.price}
                    onChange={(e) =>
                        handleFormChange("price", parseFloat(e.target.value))
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
                        <h5>Производство</h5>
                        <label>
                            <input
                                type="radio"
                                name="isProducer"
                                value={true}
                                checked={formState.isProducer === true}
                                onChange={() => handleFormChange("isProducer", true)}
                            />
                            Производитель
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="isProducer"
                                value={false}
                                checked={formState.isProducer === false}
                                onChange={() => handleFormChange("isProducer", false)}
                            />
                            Дистрибьютор
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
                                <div className={styles.card} style={{height:"300px" , width:"300px"}}>
                                    {photo.file ? (
                                        <img
                                            src={URL.createObjectURL(photo.file)}
                                            alt={`Фото ${index + 1}`}
                                        />
                                    ) : (
                                        <input
                                            style={{height:"300px" , width:"300px"}}
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
                        <button type="button" onClick={handleAddPhoto}   style={{height:"300px" , width:"300px"}}>
                            Добавить фото
                        </button>
                    </div>
                </div>

                <button type="submit" className={styles.saveButton}>
                    Сохранить
                </button>

                {error && <p style={{color: "red"}}>{error}</p>}
            </form>
        </main>
    );
};

export default FormFoAdd;
