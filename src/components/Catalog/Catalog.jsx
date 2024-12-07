import styles from './Catalog.module.scss';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchByDistr, fetchByProducer} from "../../store/slices/getProducts.js";
import {useTranslation} from "react-i18next";

const Catalog = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const topProducts = useSelector((state) => state.products.filteredProducts);
    const bottomProducts = useSelector((state) => state.products.distr);

    useEffect(() => {
        dispatch(fetchByDistr());
        dispatch(fetchByProducer());
    }, []);

    const topProductsToShow = topProducts.slice(0, 4);
    const bottomProductsToShow = bottomProducts.slice(0, 4);

    return (
        <div className={styles.catalog}>
            <section className={styles.title}>
                <h3>{t("catalog.title")}</h3>
                <Link to={"/catalog"}> {t("catalog.link")}</Link>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h2>{t("catalog.subtitle1")}</h2>
                    <p>
                        {t("catalog.description1")}
                    </p>
                    <Link to={"/catalog"} className={styles.link}>{t("catalog.link")}</Link>
                </div>
                <div className={styles.productGrid}>
                    {topProductsToShow.map(product => (
                        <Link to={`/catalog/${product.collection_id ? "product" : "collection"}/${product.id}`}
                              key={product.id} className={styles.productCard}>
                            <div className={styles.brandLabel}>Garant</div>

                            {product?.photos?.[0]?.url ? (
                                <img src={product.photos[0].url} alt={product.name || "Product"} />
                            ) : (
                                <p>Изображение отсутствует</p>
                            )}

                            <aside className={styles.productAside}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productPrice}>{product.price}</p>
                            </aside>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContent_black}>
                    <h2>{t("catalog.subtitle2")}</h2>
                    <p>
                        {t("catalog.description2")}
                    </p>
                    <Link to={"/catalog"} className={styles.link}>{t("catalog.link2")}</Link>
                </div>
                <div className={styles.productGrid}>
                    {bottomProductsToShow.map(product => (
                        <Link to={`/catalog/${product.collection_id ? "product" : "collection"}/${product.id}`}
                              key={product.id} className={styles.productCard}>
                            <img src={img} alt={product.name} className={styles.productImage}/>
                            <aside className={styles.productAside}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productPrice}>{product.price}</p>
                            </aside>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Catalog;
