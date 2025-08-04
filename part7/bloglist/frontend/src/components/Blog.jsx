import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import commentsService from "../services/comments";
import { addNewComment } from "../reducers/blogsReducer";
import { useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";

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

  const createComment = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      addNewComment({ blogId: id, content: comment })
    );
    if (result.payload) {
      setComments((prev) => [...prev, result.payload.comment]);
      setCommentValue("");
    }
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
        {blog.likes} likes <Button onClick={() => likeBlog(blog)}>like</Button>
      </p>
      <p>added by {blog.user?.name || "unknown"}</p>
      <Button onClick={() => removeBlog(blog)}>remove</Button>

      <h3>comments</h3>
      <Form onSubmit={createComment}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setCommentValue(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit">add comment</Button>
      </Form>

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
