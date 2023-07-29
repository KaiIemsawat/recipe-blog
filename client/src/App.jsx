import { Route, Routes } from "react-router-dom";

import "./App.css";
import Posts from "./assets/components/Posts";
import Header from "./assets/components/Header";
import Layout from "./assets/components/Layout";
import IndexPage from "./assets/components/pages/IndexPage";
import LoginPage from "./assets/components/pages/LoginPage";
import RegisterPage from "./assets/components/pages/RegisterPage";
import { UserContextProvider } from "./assets/components/UserContext";
import CreatePostPage from "./assets/components/pages/CreatePostPage";
import PostPage from "./assets/components/pages/PostPage";
import EditPost from "./assets/components/pages/EditPost";

function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<IndexPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/create" element={<CreatePostPage />} />
                    <Route path="/post/:id" element={<PostPage />} />
                    <Route path="/edit/:id" element={<EditPost />} />
                </Route>
            </Routes>
        </UserContextProvider>
    );
}

export default App;
