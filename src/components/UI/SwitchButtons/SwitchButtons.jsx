import styles from './SwitchButtons.module.scss';
import {useTranslation} from "react-i18next";
const SwitchButtons = ({ active, onClick }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.switch_btn}>
            <button
                className={active === 'pop' ? styles.active : ''}
                onClick={() => onClick('pop')}
            >
                {t("new.title1")}
            </button>
            <button
                className={active === 'new' ? styles.active : ''}
                onClick={() => onClick('new')}
            >
                {t("new.title2")}
            </button>
        </div>
    );
};

export default SwitchButtons;
