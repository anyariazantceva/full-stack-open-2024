import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import commentsService from "../services/comments";
import { addNewComment } from "../reducers/blogsReducer";
import { useDispatch } from "react-redux";

const Blog = ({ blogs, likeBlog, removeBlog }) => {
  const id = useParams().id;
  const blog = blogs.find((b) => b.id === id);
  const [comments, setComments] = useState([]);
  const [comment, setCommentValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const allComments = await commentsService.getAll();
        const blogComments = allComments.filter((c) => c.blog === id);
        setComments(blogComments);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };
    fetchComments();
  }, [id]);

  const createComment = (e) => {
    e.preventDefault();
    dispatch(addNewComment({ blogId: id, comment: comment }));
  };

  if (!blog) {
    return <p>Blog not found.</p>;
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        {blog.likes} likes <button onClick={() => likeBlog(blog)}>like</button>
      </p>
      <p>added by {blog.user?.name || "unknown"}</p>
      <button onClick={() => removeBlog(blog)}>remove</button>

      <h3>comments</h3>
      <form onSubmit={createComment}>
        <input
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setCommentValue(e.target.value)}
        />
        <button type="submit">add comment</button>
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet</p>
      ) : (
        <ul>
          {comments.map((c) => (
            <li key={c.id}>{c.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

Blog.propTypes = {
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
