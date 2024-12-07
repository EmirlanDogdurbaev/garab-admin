import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import NavItem from "./NavItem/NavItem.jsx";
import classes from "./Nav.module.scss";
import Logo from "../UI/Logo/Logo.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setLanguage} from "../../store/slices/languageState.js";
import {fetchLanguages} from "../../store/slices/getLanguages.js";
import {
    fetchByDistributivFilter,
    fetchByProducerFilter,
    fetchByProducerIsPainted
} from "../../store/slices/filters/search.js";


const Nav = () => {
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const currentLanguage = i18n.language;

    const {data: languages, loading, error} = useSelector((state) => state.languages);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        dispatch(fetchLanguages());
    }, [dispatch]);

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        dispatch(setLanguage(lang));
    };

    if (loading) return <div>Загрузка языков...</div>;
    if (error) return <div>Ошибка загрузки языков: {error}</div>;


    const handleSearchByProducer = () => {
        dispatch(fetchByProducerFilter());
        navigate("/catalog");
    };

    const handleSearchByProducerIsPainted = () => {
        dispatch(fetchByProducerIsPainted());
        navigate("/catalog");
    };

    const handleSearchByDistributiv = () => {
        dispatch(fetchByDistributivFilter());
        navigate("/catalog");
    };

    return (
        <nav className={classes.Nav}>
            {localStorage.getItem("token") ? (
                <nav className={classes.navigation}>
                    <Link to="/">
                        <Logo/>
                    </Link>
                    <ul>
                        <li>
                            <Link to={"/admin/all-products"}>Все товары</Link>
                        </li>
                        <li>
                            <Link to={"/admin/discount"}>Акции</Link>
                        </li>
                        <li>
                            <Link to={"/admin/all-collections"}>Коллекции</Link>
                        </li>
                        <li>
                            <Link to={"/admin/all-category"}>Категории</Link>
                        </li>
                        <li>
                            <Link to={"/admin/all-vacancies"}>Вакансии</Link>
                        </li>
                        <li>
                            <Link to={"/admin/brands"}>Клиенты</Link>
                        </li>
                    </ul>
                </nav>
            ) : (
                <>
                    <div
                        className={`${classes.bottom_nav} ${
                            isMenuOpen ? classes.active : ""
                        }`}
                    >
                        <nav className={classes.nav}>
                            <Link to="/">
                                <Logo/>
                            </Link>
                            <ul>
                                <div className={classes.navItem}>
                                    <div className={classes.languageSelector}>
                                        {t("nav.production")}
                                        <div className={classes.dropdownMenu}>
                                            <div className={`${classes.inner} ${classes.custom}`}>
                                                <div onClick={handleSearchByProducer}>
                                                    {t("nav.item1")}
                                                </div>
                                                <div onClick={handleSearchByProducerIsPainted}>
                                                    {t("nav.item2")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={classes.languageSelector}
                                    onClick={handleSearchByDistributiv}
                                >
                                    {t("nav.distribution")}
                                </div>

                                <NavItem to="/vacancy">{t("nav.vacancies")}</NavItem>

                                <div className={classes.languageSelector}>
                                    {currentLanguage === "en"
                                        ? "English"
                                        : currentLanguage === "ru"
                                            ? "Русский"
                                            : currentLanguage === "kgz"
                                                ? "Кыргызча"
                                                : ""}

                                    <div className={classes.dropdownMenu}>
                                        <div className={classes.inner}>
                                            {languages?.map((language) => (
                                                <div
                                                    key={language.code}
                                                    onClick={() => handleLanguageChange(language.code)}
                                                >
                                                    {language.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </ul>
                            <div className={classes.burger} onClick={toggleMenu}>
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4 8H28M4 16H28M4 24H28"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </nav>
                    </div>
                    {isMenuOpen && (
                        <div
                            className={`${classes.mobileMenu} ${
                                isMenuOpen ? classes.active : ""
                            }`}
                        >
                            <div onClick={toggleMenu}>
                                <svg
                                    width="41"
                                    height="40"
                                    viewBox="0 0 41 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M34.1667 35.1876C33.9426 35.1903 33.7205 35.1466 33.5145 35.0594C33.3086 34.9722 33.1234 34.8434 32.9708 34.6813L5.6375 7.68131C4.95417 7.00631 4.95417 5.96006 5.6375 5.28506C6.32083 4.61006 7.38 4.61006 8.06333 5.28506L35.3625 32.3188C36.0458 32.9938 36.0458 34.0401 35.3625 34.7151C35.0208 35.0526 34.5767 35.2213 34.1667 35.2213V35.1876Z"
                                        fill="#212529"
                                        fillOpacity="0.8"
                                    />
                                    <path
                                        d="M6.83333 35.1875C6.60928 35.1902 6.38714 35.1466 6.18119 35.0594C5.97524 34.9722 5.79004 34.8434 5.6375 34.6813C4.95417 34.0063 4.95417 32.96 5.6375 32.285L32.9708 5.31875C33.6542 4.64375 34.7133 4.64375 35.3967 5.31875C36.08 5.99375 36.08 7.04 35.3967 7.715L8.02917 34.6813C7.6875 35.0188 7.24333 35.1875 6.83333 35.1875Z"
                                        fill="#212529"
                                        fillOpacity="0.8"
                                    />
                                </svg>
                            </div>
                            <ul>
                                <NavItem to="/">{t("nav.production")}</NavItem>
                                <NavItem to="/ax">{t("nav.distribution")}</NavItem>
                                <NavItem to="/vacancy">{t("nav.vacancies")}</NavItem>
                                <NavItem to="/ax">{t("nav.language")}</NavItem>
                            </ul>
                        </div>
                    )}
                </>
            )}
        </nav>
    );
};

export default Nav;
