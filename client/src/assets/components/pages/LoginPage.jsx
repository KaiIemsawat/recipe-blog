import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUserInfo } = useContext(UserContext);

    const nav = useNavigate();

    const loginHandler = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
            credentials: "include", // ! <-- important to follow for getting jwt cookies
        });
        if (response.ok) {
            response.json().then((userInfo) => {
                setUserInfo(userInfo);
                nav("/");
            });
        } else {
            alert("Invalid Credentials");
        }
    };

    return (
        <form className="login" onSubmit={loginHandler}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button>Login</button>
        </form>
    );
};

export default LoginPage;
