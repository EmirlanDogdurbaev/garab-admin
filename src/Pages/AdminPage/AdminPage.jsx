import styles from "./AdminPage.module.scss";

const AdminPage = ({children}) => {
    return (
        <div className={styles.admin}>
            <section>

            </section>

            {children}
        </div>
    )
}

export default AdminPage;