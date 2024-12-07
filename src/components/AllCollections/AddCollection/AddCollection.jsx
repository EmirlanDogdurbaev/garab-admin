import FormFoAdd from "../../UI/FormFoAdd/FormFoAdd.jsx";
import styles from "./AddCollection.module.scss";
const AddCollection = () => {
    return (

        <div className={styles.AddCollection}>
            <div className={styles.inner}>
                <section className={styles.title}>
                    <h2>Коллекции / добавить товар </h2>
                    <div className={styles.line}></div>
                </section>

                <FormFoAdd/>
            </div>
        </div>
    )
}

export default AddCollection;