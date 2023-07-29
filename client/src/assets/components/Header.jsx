import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const Header = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);

    useEffect(() => {
        fetch("http://localhost:8000/api/profile", {
            credentials: "include", // ! to get credentials
        }).then((response) => {
            response.json().then((userInfo) => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    const logoutHandler = () => {
        fetch("http://localhost:8000/api/logout", {
            credentials: "include",
            method: "POST",
        });
        setUserInfo(null);
    };

    const email = userInfo?.email;

    return (
        <header>
            <Link to="/" className="logo">
                My Blog
            </Link>
            <nav>
                {email ? (
                    <>
                        <Link to={"/create"}>Create New Post</Link>
                        <a onClick={logoutHandler}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
