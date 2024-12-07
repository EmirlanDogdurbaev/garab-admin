import styles from "./Brands.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchBrands} from "../../../store/slices/admin/brands/brands.js";
import {useTranslation} from "react-i18next";

const Brands = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const brands = useSelector((state) => state.brands.brands);

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    return (
        <>
            <section className={styles.title}>
                <h3>{t("partners.title")}</h3>
            </section>
            <div className={styles.Brands}>
                <div className={styles.marquee}>
                    <div className={styles.marqueeContent}>
                        {brands.length > 0 && (
                            <>
                                <img
                                    src={brands[0].photo}
                                    alt={`Logo ${brands[0].name}`}
                                    className={styles.logo}
                                />
                                {brands.map((logo) => (
                                    <img
                                        key={logo.id}
                                        src={logo.photo}
                                        alt={`Logo ${logo.name}`}
                                        className={styles.logo}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Brands;
