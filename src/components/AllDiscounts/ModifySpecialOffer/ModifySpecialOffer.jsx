import styles from './ModifySpecialOffer.module.scss';
import {useEffect, useState} from "react";
import Select from "react-select";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllProducts} from "../../../store/slices/getProducts.js";
import {fetchAllCollections} from "../../../store/slices/admin/collections/collections.js";
import {API_URI} from "../../../store/api/api.js";

const ModifySpecialOffer = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [discount, setDiscount] = useState(15);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedTargetId, setSelectedTargetId] = useState(null);
    const items = useSelector((state) => state.products.data);
    const collections = useSelector((state) => state.collections.data);

    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedType?.value === "item") {
            dispatch(fetchAllProducts());
        } else if (selectedType?.value === "collection") {
            dispatch(fetchAllCollections());
        }
    }, [dispatch, selectedType]);



    const options = [
        {value: "collection", label: "Коллекция"},
        {value: "item", label: "Продукт"},
    ];

    const handleRadioChange = (id) => {
        setSelectedTargetId(id);
    };

    const handleSave = async () => {
        if (!selectedType || !startDate || !endDate || !selectedTargetId) {
            alert("Заполните все поля перед сохранением.");
            return;
        }

        const payload = {
            discount_type: selectedType.value,
            target_id: selectedTargetId,
            discount_percentage: parseFloat(discount),
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
        };

        console.log(payload)

        try {
            const response = await axios.post(`${API_URI}/discount`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            console.log(response.data);
            alert("Спецпредложение успешно сохранено!");
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Ошибка при сохранении:", error.response?.data || error.message);
            alert("Ошибка при сохранении.");
        }
    };


    return (
        <div className={styles.promotionForm}>
            <h2>Акции / Создать спецпредложение</h2>
            <div className={styles.line}></div>

            <div className={styles.select_section}>
                <h3>Выберите тип продукта</h3>
                <Select
                    options={options}
                    styles={customStyles}
                    name="productType"
                    placeholder="Выберите тип"
                    onChange={(selectedOption) => setSelectedType(selectedOption)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.customTable}>
                    <tbody>
                    {selectedType?.value === "collection" ? (
                        collections.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name} <input
                                    type="radio"
                                    name="collection"
                                    onChange={() => handleRadioChange(item.ID)}
                                /></td>

                            </tr>
                        ))
                    ) : selectedType?.value === "item" ? (
                        items.map((item) => (
                            <tr key={item.id}>
                                <td >{item.name} <input
                                    type="radio"
                                    name="item"
                                    onChange={() => handleRadioChange(item.ID)}
                                /></td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="2">Выберите тип продукта для отображения списка</td>
                        </tr>
                    )}
                    </tbody>


                </table>
            </div>

            <div className={styles.dateInputContainer}>
                <h3>Выберите период действия и размер акции</h3>
                <div className={styles.inner_container}>
                    <label>
                        Дата начала:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    <label>
                        Дата окончания:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                    <label>
                        Скидка (%):
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            min="0"
                            max="100"
                        />
                    </label>
                </div>
            </div>

            <button onClick={handleSave} className={styles.saveButton}>
                Сохранить
            </button>
        </div>
    );
};

export default ModifySpecialOffer;


export const customStyles = {
    control: (provided) => ({
        ...provided,
        border: "1px solid black",
        borderRadius: "5px",
        outline: "none",
    }),
};