import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {signup} from "../../../store/slices/auth/auth.js";
import styles from "./Register.module.scss";

const Register = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const loading = useSelector((state) => state.auth.status === "loading");
    const error = useSelector((state) => state.auth.error);
    const token = useSelector((state) => state.auth.token);

    const handleSignup = () => {
        dispatch(signup({username, password}));
    };

    if (token) {
        return null;
    }

    return (
        <div className={styles.Register}>
            <div>
                <h2>Signup</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={() => {
                        handleSignup();
                    }}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Signup"}
                </button>
                {error && <p>Error: {error}</p>}
            </div>
        </div>
    );
};

export default Register;