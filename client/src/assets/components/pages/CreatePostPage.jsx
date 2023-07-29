import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
];

const CreatePostPage = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");

    const nav = useNavigate();

    const cretePostHandler = async (e) => {
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);
        data.set("file", files[0]); // ! "file" needs to be the same name as in backend
        e.preventDefault();

        const response = await fetch("http://localhost:8000/api/create-post", {
            method: "POST",
            body: data,
            credentials: "include",
        });

        if (response.ok) {
            nav("/");
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
            <ReactQuill
                value={content}
                onChange={(newValue) => setContent(newValue)}
                modules={modules}
                formats={formats}
            />
            <button className="submit-post">submit post</button>
        </form>
    );
};

export default CreatePostPage;
