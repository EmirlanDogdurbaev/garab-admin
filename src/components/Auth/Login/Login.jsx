import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import styles from "./Login.module.scss";
import {login} from "../../../store/slices/auth/auth.js";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const loading = useSelector((state) => state.auth.status === "loading");
    const error = useSelector((state) => state.auth.error);

    const handleLogin = () => {
        dispatch(login({password, username})).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                navigate("/register");
            } else {
                console.log("Ошибка входа:", response.error.message);
            }
        });
    };


    return (
        <div className={styles.Login}>
            <div>
                <h2>Войти</h2>

                <input
                    type="text"
                    placeholder="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span>
                    <button onClick={handleLogin} disabled={loading}>
                        {loading ? "Загрузка..." : "Войти"}
                    </button>
                    <Link to="/register">Регистрация</Link>
                </span>
                {error && <p>Error: {error}</p>}
            </div>
        </div>
    );
};

export default Login;