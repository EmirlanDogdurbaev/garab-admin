import {useDispatch, useSelector} from 'react-redux';
import {searchByInputValue, setInputValue} from '../../store/slices/getProducts.js';
import {useEffect, useState} from 'react';
import styles from './SearchBar.module.scss';
import {clearError} from "../../store/slices/filters/search.js";
import {useTranslation} from "react-i18next";

const SearchBar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [localInputValue, setLocalInputValue] = useState('');  // Локальное состояние для инпута
    const inputValue = useSelector((state) => state.search.filters.inputValue); // Значение из Redux (можно использовать для синхронизации)
    const handleChange = (e) => {
        dispatch(clearError());
        const value = e.target.value;
        setLocalInputValue(value);
        dispatch(setInputValue(value));
    };

    useEffect(() => {
        setLocalInputValue(inputValue);
    }, [inputValue]);

    const handleSearch = () => {
        if (localInputValue) {
            dispatch(searchByInputValue(localInputValue));
        }
    };


    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder={t("catalog_page.search")}
                onChange={handleChange}
                value={localInputValue}
                className={styles.searchInput}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                    <path
                        d="M5.83184 26.0321L13.9203 17.9437C14.5661 18.494 15.3088 18.9198 16.1484 19.2212C16.988 19.5226 17.8319 19.6733 18.68 19.6733C20.7484 19.6733 22.4991 18.9572 23.932 17.5252C25.3649 16.0932 26.0813 14.343 26.0813 12.2746C26.0813 10.2062 25.3657 8.45513 23.9345 7.02138C22.5034 5.58763 20.7536 4.86989 18.6852 4.86817C16.6168 4.86644 14.8653 5.58289 13.4307 7.0175C11.9961 8.45211 11.2788 10.2032 11.2788 12.2707C11.2788 13.168 11.4377 14.0364 11.7554 14.876C12.0732 15.7156 12.4908 16.4338 13.0083 17.0305L4.91992 25.1176L5.83184 26.0321ZM18.6788 18.3803C16.9651 18.3803 15.5185 17.7904 14.3388 16.6107C13.159 15.431 12.5692 13.9839 12.5692 12.2694C12.5692 10.5549 13.159 9.10828 14.3388 7.92942C15.5185 6.75056 16.9651 6.16069 18.6788 6.15983C20.3924 6.15897 21.8395 6.74883 23.02 7.92942C24.2006 9.11 24.7905 10.5567 24.7896 12.2694C24.7888 13.9822 24.1989 15.4288 23.02 16.6094C21.8412 17.79 20.3945 18.3799 18.68 18.379"
                        fill="#212529"
                    />
                </svg>
            </button>
        </div>
    );
};

export default SearchBar;
