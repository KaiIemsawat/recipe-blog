import { useEffect, useState } from "react";
import Posts from "../Posts";

const IndexPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/posts").then((response) => {
            response.json().then((posts) => {
                setPosts(posts);
            });
        });
    }, []);
    return (
        <div>
            {posts.length > 0 &&
                posts.map((eachPost) => (
                    <Posts key={eachPost._id} {...eachPost} />
                ))}
        </div>
    );
};

export default IndexPage;
