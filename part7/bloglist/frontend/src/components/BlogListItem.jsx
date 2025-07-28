import { useState } from "react";
import { Link } from "react-router-dom";

const BlogListItem = ({ blog, likeBlog, removeBlog }) => {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  return (
    <div style={{ border: "1px solid", padding: 10, marginBottom: 5 }}>
      <strong>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </strong>
      <button onClick={toggle}>{show ? "hide" : "show"}</button>
      {show && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button onClick={() => likeBlog(blog)}>like</button>
          </p>
          <p>{blog.user?.name}</p>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </div>
      )}
    </div>
  );
};

export default BlogListItem;
