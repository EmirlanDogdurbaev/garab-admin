import styles from "./UpdateProducts.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {API_URI} from "../../../store/api/api.js";
import Select from "react-select";
import {customStyles} from "../../AllDiscounts/ModifySpecialOffer/ModifySpecialOffer.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllCollections} from "../../../store/slices/admin/collections/collections.js";
import {fetchCategories} from "../../../store/slices/getCategories.js";
import {useNavigate, useParams} from "react-router-dom";


const UpdateProducts = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const categoriesList = useSelector((state) => state.categories.categories);
    const collectionsList = useSelector((state) => state.collections.data);
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({show: false, message: "", type: ""});
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        price: 0,
        isProducer: true,
        isAqua: false,
        isGarant: false,
        isPainted: false,
        isPopular: false,
        isNew: false,
        category_id: null,
        collection_id: null,
        items: [
            {name: "", description: "", language_code: "ru"},
            {name: "", description: "", language_code: "kgz"},
            {name: "", description: "", language_code: "en"},
        ],
    });

    const handleExclusiveToggle = (field) => {
        setFormState((prev) => ({
            ...prev,
            isProducer: false,
            isAqua: false,
            isGarant: false,
            [field]: true,
        }));
    };


    useEffect(() => {
        dispatch(fetchAllCollections());
        dispatch(fetchCategories());

        const fetchProductData = async () => {
            try {
                const response = await axios.get(`${API_URI}/getItemById?item_id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const productData = response.data;

                console.log(productData);

                setFormState({
                    price: productData.price || 0,
                    isProducer: productData.isProducer || false,
                    isPainted: productData.isPainted || false,
                    isPopular: productData.is_popular || false,
                    isNew: productData.is_new || false,
                    category_id: productData.category_id || null,
                    collection_id: productData.collection_id || null,
                    items: productData.items || [
                        {name: "", description: "", language_code: "ru"},
                        {name: "", description: "", language_code: "kgz"},
                        {name: "", description: "", language_code: "en"},
                    ],
                });

                setPhotos(
                    Array.isArray(productData.photos)
                        ? productData.photos.map((photo) => ({
                            file: null,
                            isMain: photo.isMain,
                            hashColor: photo.hashColor,
                            url: photo.url,
                        }))
                        : []
                );

                setLoading(false);
            } catch (err) {
                setError("Ошибка загрузки данных товара.");
                console.error(err);
            }
        };

        fetchProductData();
    }, [dispatch, id]);


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


    const handleFileReplace = (index) => {
        const updatedPhotos = [...photos];
        updatedPhotos[index].file = null;
        updatedPhotos[index].url = null;
        setPhotos(updatedPhotos);
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
            "item",
            JSON.stringify({
                price: formState.price,
                isProducer: formState.isProducer,
                isAqua: formState.isAqua,
                isGarant: formState.isGarant,
                isPainted: formState.isPainted,
                is_popular: formState.isPopular,
                is_new: formState.isNew,
                items: formState.items,
                collection_id: formState.collection_id,
                category_id: formState.category_id,
                size: "M",
            })
        );

        photos.forEach((photo) => {
            if (photo.file) {
                formData.append(`photos`, photo.file);
                formData.append(`isMain_${photo.file.name}`, photo.isMain);
                formData.append(`hashColor_${photo.file.name}`, photo.hashColor);
            }
        });

        try {
             await axios.put(`${API_URI}/items?item_id=${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setModal({show: true, message: "Товар успешно обновлён", type: "success"});
            navigate("/admin/all-products");
        } catch (err) {
            setError(err.response?.data || "Ошибка при обновлении товара.");
            console.error("Ошибка:", err);
        }
    };


    const closeModal = () => {
        setModal({show: false, message: "", type: ""});
    };
    if (loading) return <p>Загрузка...</p>;


    console.log("Photos:", photos);

    return (
        <div className={styles.AddCollection}>
            <div className={styles.inner}>
                <section className={styles.title}>
                    <h2>Коллекции / изменить товар {collectionsList.name}</h2>
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
                            <label className={styles.priceLabel}>
                                <h5>Цена</h5>
                                <input
                                    type="number"
                                    placeholder="Введите цену"
                                    required
                                    value={formState.price}
                                    onChange={(e) =>
                                        handleFormChange("price", parseFloat(e.target.value))
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

                            {Array.isArray(photos) && photos.map((photo, index) => (
                                <div key={index} className={styles.cardWrapper}>
                                    <div className={styles.card} style={{height: "300px", width: "300px"}}>
                                        {photo.file ? (
                                            <img
                                                src={URL.createObjectURL(photo.file)}
                                                alt={`Фото ${index + 1}`}
                                            />
                                        ) : photo.url ? (
                                            <img
                                                src={`${photo.url}`}
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
                    {error && <p style={{color: "red"}}>{typeof error === "string" ? error : JSON.stringify(error)}</p>}
                </form>
            </div>
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

export default UpdateProducts;
