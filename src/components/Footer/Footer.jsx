import styles from "./Footer.module.scss";
import GoogleMAP from "./GoogleMap/GoogleMAP.jsx";
import {Link} from "react-router-dom";
import {FaPhone} from 'react-icons/fa';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchVacancies} from "../../store/slices/getVacancy.js";
import {useTranslation} from "react-i18next";

export default function Footer() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {vacancies} = useSelector((state) => state.vacancies);

    useEffect(() => {
        dispatch(fetchVacancies())
    }, [])


    const data3 = vacancies.slice(0, 3);

    return (
        <div className={styles.wrap}>
            <div className={styles.content}>
                <div className={styles.map}>
                    <GoogleMAP/>
                </div>
                <div className={styles.info}>
                    <div className={styles.adresses}>
                        <h6>{t("footer.addresses")}</h6>
                        <ul>
                            <Link to="https://maps.app.goo.gl/JdbygE2Ehi4WX5VA9">
                                <p>
                                    <b>{t("footer.city1")}: </b>
                                    <br/>
                                    {t("footer.address1")}
                                </p>
                            </Link>
                            <Link to="https://maps.app.goo.gl/cJjc97mkECiUzkVJ8">
                                <p>
                                    <b>{t("footer.city2")}: </b>
                                    <br/>
                                    {t("footer.address2")}
                                </p>
                            </Link>
                        </ul>
                    </div>
                    <div className={styles.contacts}>
                        <h6>{t("footer.contacts")}</h6>
                        <ul>
                            <li>
                                <a href="tel:+996500000104">
                                    <FaPhone className={styles.icon}/> +996 500 000 104
                                </a>
                            </li>
                            <li>
                                <a href="tel:+996997000104">
                                    {" "}
                                    <FaPhone className={styles.icon}/> +996 997 000 104
                                </a>
                            </li>
                            <li>
                                <a href="tel:+996222000104">
                                    {" "}
                                    <FaPhone className={styles.icon}/> +996 222 000 104
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.vacancies}>
                        <h6>{t("footer.vacancies")}</h6>
                        <ul>

                            {data3.map((vacancies) => (
                                <li key={vacancies.id}>
                                    <Link to={`/vacancy`}>{vacancies.title}</Link>
                                </li>
                            ))}
                            <Link to="/vacancy">{t("footer.see_more")}</Link>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
