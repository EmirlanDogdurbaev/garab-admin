import styles from './SwitchSection.module.scss';
import {useEffect, useState} from "react";
import SwitchButtons from "../UI/SwitchButtons/SwitchButtons.jsx";
import CardSlider from "../UI/CardSlider/CardSlider.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchPopularProducts, fetchNewProducts} from "../../store/slices/getProducts.js";
import {useTranslation} from "react-i18next";

const SwitchSection = () => {
    const dispatch = useDispatch();
    const popularProducts = useSelector((state) => state.products.popularProducts);
    const newProducts = useSelector((state) => state.products.newProducts);
    const language = useSelector((state) => state.language.currentLanguage);
    const [active, setActive] = useState('pop');

    useEffect(() => {
        if (active === 'pop') {
            dispatch(fetchPopularProducts());
        } else if (active === 'new') {
            dispatch(fetchNewProducts());
        }
    }, [language, active, dispatch]);

    const handleClick = (button) => {
        setActive(button);
    };

    return (
        <section className={styles.SwitchSection}>
            <SwitchButtons active={active} onClick={handleClick} />
            <CardSlider cards={active === 'new' ?  newProducts : popularProducts} />
        </section>
    );
};

export default SwitchSection;
