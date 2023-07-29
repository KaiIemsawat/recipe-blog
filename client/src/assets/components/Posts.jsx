// import { formatISO9075 } from "date-fns";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Posts = ({ _id, title, summary, cover, content, createdAt, author }) => {
    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={`http://localhost:8000/${cover}`} alt="" />
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <a href="" className="author">
                        {author.username}
                    </a>
                    {/* "PP - pp" is one of the date time formats */}
                    <time>{format(new Date(createdAt), "PP - pp")}</time>
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
};

export default Posts;
