import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../Editor";

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");

    const nav = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/api/post/${id}`).then((response) => {
            response.json().then((postInfo) => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            });
        });
    }, []);

    const updatePostHandler = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);
        data.set("id", id);
        if (files?.[0]) {
            data.set("file", files[0]); // ! "file" needs to be the same name as in backend
        }

        if (title && summary && files) {
            // Validate ig=f title or summary is filled
            const response = await fetch("http://localhost:8000/api/post", {
                method: "PUT",
                body: data,
                credentials: "include",
            });
            if (response.ok) {
                nav(`/post/${id}`);
            } else {
                alert("please ensure if it is an image type file");
            }
        } else {
            if (!title) {
                alert("title can not be empty");
            }
            if (!summary) {
                alert("summary can not be empty");
            }
            if (!files) {
                alert("proper image file is needed");
            }
        }
    };

    return (
        <form onSubmit={updatePostHandler}>
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
            <Editor onChange={setContent} value={content} />
            <button className="submit-post">update post</button>
        </form>
    );
};

export default EditPost;
