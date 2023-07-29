import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const nav = useNavigate();

    const registerHandler = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
            headers: { "Content-Type": "application/json" },
        });
        if (password === confirmPassword) {
            if (response.status === 200) {
                alert("Registered!!");
                nav("/login");
            } else {
                alert("Registeration failed");
            }
        } else {
            alert("password confirmation is incorrect");
            console.log("password confirmation is incorrect");
        }
    };

    return (
        <form className="register" onSubmit={registerHandler}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
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
            <input
                type="password"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button>Register</button>
        </form>
    );
};

export default RegisterPage;
