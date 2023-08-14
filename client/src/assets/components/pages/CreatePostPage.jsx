import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Editor from "../Editor";

const CreatePostPage = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");

    const nav = useNavigate();

    const cretePostHandler = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);
        data.set("file", files[0]); // ! "file" needs to be the same name as in backend

        if (title && summary) {
            // Validate ig=f title or summary is filled
            const response = await fetch(
                "http://localhost:8000/api/create-post",
                {
                    method: "POST",
                    body: data,
                    credentials: "include",
                }
            );
            if (response.ok) {
                nav("/");
            }
        } else {
            if (!title) {
                alert("title can not be empty");
            }
            if (!summary) {
                alert("summary can not be empty");
            }
        }
    };

    return (
        <form onSubmit={cretePostHandler}>
            <input
                type="text"
                placeholder={"title"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder={"summary"}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />
            <input type="file" onChange={(e) => setFiles(e.target.files)} />
            <Editor value={content} onChange={setContent} />
            <button className="submit-post">submit post</button>
        </form>
    );
};

export default CreatePostPage;
