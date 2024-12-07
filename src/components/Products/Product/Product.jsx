import styles from "./Product.module.scss";
import {Link} from "react-router-dom";

const Product = ({name, price, image, id, producer}) => {
    console.log(producer)
    return (
        <Link to={`product/${id}`} className={styles.Product} >
            {producer && <span className={styles.brand}>iskender</span>}
            <div>
                <img src={image} alt={name}/>
                <aside>

                    <h4>{name}</h4>
                    <div className={styles.line}/>
                    <p>{price} som</p>
                </aside>
            </div>
        </Link>
    )
}

export default Product;