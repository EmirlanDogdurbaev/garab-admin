import {useDispatch, useSelector} from 'react-redux';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import CategorySlider from '../../components/CategorySlider/CategorySlider.jsx';
import {useEffect, useState} from 'react';
import styles from './CatalogPage.module.scss';
import {fetchCategories} from "../../store/slices/getCategories.js";

import ModalFilter from "../../components/Catalog/ModalFilter/ModalFilter.jsx"
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import placeholderImage from "../../assets/img.png";

const CatalogPage = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const results = useSelector((state) => state.search.results);
    const categories = useSelector((state) => state.categories.categories);
    const categoriesLoading = useSelector((state) => state.categories.loading);
    const categoriesError = useSelector((state) => state.categories.error);
    const selectedCategory = useSelector((state) => state.search.filters.category);
    const [isModalOpen, setModalOpen] = useState(false);
    const language = useSelector((state) => state.language.currentLanguage);
    const inputValue = useSelector((state) => state.search.filters.inputValue);
    const {error, loading} = useSelector((state) => state.search)

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch, language]);

    console.log(results)

    const isNoResults = !results || (Array.isArray(results) && results.length === 0 && (selectedCategory || (inputValue?.length || 0) > 0));

    return (
        <div className={styles.CatalogPage}>
            <section className={styles.searchbar}>
                <div className={styles.top}>
                    <SearchBar/>
                    <button className={styles.filter}
                            onClick={() => setModalOpen(true)}>{t("catalog_page.filter")}</button>
                </div>
                <div>
                    {categoriesLoading ? (<p>Loading categories...</p>) : categoriesError ? (
                        <p>Error loading categories: {categoriesError}</p>) : (
                        <CategorySlider categories={categories}/>)}
                </div>
            </section>

            <section className={styles.results_container}>
                {error ? (
                    <div className={styles.noResults}>{t("noResults")}</div>
                ) : (
                    Array.isArray(results) && results.length > 0 ? (
                        <div className={styles.card_cont}>
                            {results.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/catalog/${item.collection_id ? "product" : "collection"}/${item.id}`}
                                    className={styles.card}
                                >
                                    {item.isProducer && <span className={styles.brand}>iskender</span>}
                                    <div>
                                        <img src={item.photos?.[0]?.url || placeholderImage} alt={item.name}/>
                                        <aside>
                                            <h4>{item.name}</h4>
                                            <div className={styles.line}/>
                                            <p>{item.price} som</p>
                                        </aside>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResults}>{t("noProductsFound")}</div> // Сообщение о том, что продукты не найдены
                    )
                )}
            </section>

            {isModalOpen && <ModalFilter onClose={() => setModalOpen(false)}/>}
        </div>);
};

export default CatalogPage;
