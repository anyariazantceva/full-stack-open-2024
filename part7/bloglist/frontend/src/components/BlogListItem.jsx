import { Link } from "react-router-dom";

const BlogListItem = ({ blog }) => {
  return (
    <div style={{ border: "1px solid", padding: 10, marginBottom: 5 }}>
      <strong>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </strong>
    </div>
  );
};

export default BlogListItem;
