import styles from "./CreateProduct.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import { API_URI } from "../../../store/api/api.js";
import Select from "react-select";
import {customStyles} from "../../AllDiscounts/ModifySpecialOffer/ModifySpecialOffer.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllCollections} from "../../../store/slices/admin/collections/collections.js";
import {fetchCategories} from "../../../store/slices/getCategories.js";

const CreateProduct = () => {
    const dispatch = useDispatch();
    const categoriesList = useSelector((state) => state.categories.categories);
    const collectionsList = useSelector((state) => state.collections.data);
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);

    const [formState, setFormState] = useState({
        price: 1500.75,
        isProducer: true,
        isPainted: false,
        isPopular: true,
        isNew: true,
        category_id: null,
        collection_id: null,
        items: [
            { name: "", description: "", language_code: "ru" },
            { name: "", description: "", language_code: "kgz" },
            { name: "", description: "", language_code: "en" },
        ],
    });


    useEffect(() => {
        dispatch(fetchAllCollections());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleFormChange = (field, value) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleCollectionChange = (index, field, value) => {
        const updatedItems = [...formState.items];
        updatedItems[index][field] = value;
        setFormState((prev) => ({
            ...prev,
            items: updatedItems,
        }));
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
            "item",
            JSON.stringify({
                price: formState.price,
                isProducer: formState.isProducer,
                isPainted: formState.isPainted,
                is_popular: formState.isPopular,
                is_new: formState.isNew,
                items: formState.items,
                collection_id: formState.collection_id,
                category_id: formState.category_id,
                size:"M"
            })
        );

        photos.forEach((photo, index) => {
            if (photo.file) {
                formData.append(`photos`, photo.file);
                formData.append(`photos[${index}][isMain]`, photo.isMain);
                formData.append(`photos[${index}][hashColor]`, photo.hashColor);
            }
        });

        console.log(formData)
        try {
            const response = await axios.post(`${API_URI}/items`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Success:", response.data);
        } catch (err) {
            setError(err.response?.data || "Ошибка при создании товара.");
            console.error("Ошибка:", err);
        }
    };

    return (
        <div className={styles.AddCollection}>
            <div className={styles.inner}>
                <section className={styles.title}>
                    <h2>Коллекции / добавить товар</h2>
                    <div className={styles.line}></div>
                </section>

                <form onSubmit={handleSubmit}>
                    <div className={styles.select_section}>
                        <h3>Выберите категорию</h3>
                        <Select
                            options={categoriesList.map((category) => ({
                                value: category.id,
                                label: category.name,
                            }))}
                            styles={customStyles}
                            name="category"
                            placeholder="Выберите категорию"
                            onChange={(selectedOption) =>
                                handleFormChange("category_id", selectedOption.value)
                            }
                        />
                    </div>

                    {/* Select for collections */}
                    <div className={styles.select_section}>
                        <h3>Выберите коллекцию</h3>
                        <Select
                            options={collectionsList.map((collection) => ({
                                value: collection.ID,
                                label: collection.name,
                            }))}
                            styles={customStyles}
                            name="collection"
                            placeholder="Выберите коллекцию"
                            onChange={(selectedOption) =>
                                handleFormChange("collection_id", selectedOption.value)
                            }
                        />
                    </div>

                    {formState.items.map((item, index) => (
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
            </div>
        </div>
    );
};

export default CreateProduct;



