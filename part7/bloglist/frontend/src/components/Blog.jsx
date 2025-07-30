import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const Blog = ({ blogs, likeBlog, removeBlog }) => {
  const id = useParams().id;
  const blog = blogs.find((b) => b.id === id);

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
    </div>
  );
};

Blog.propTypes = {
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
