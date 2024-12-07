import styles from "./Vacancy.module.scss";
import JobCard from "../../components/JobCard/JobCard.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchVacancies} from "../../store/slices/getVacancy.js";
import {useTranslation} from "react-i18next";

const Vacancy = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {vacancies} = useSelector((state) => state.vacancies);

    useEffect(() => {
        dispatch(fetchVacancies())
    }, [])
    return (
        <div className={styles.jobList}>
            <div className={styles.title}>
                <h5>{t("vacancies.title")}</h5>
            </div>
            {vacancies?.map((job) => (
                <JobCard key={job.id} job={job}/>
            ))}
        </div>
    )
}

export default Vacancy;