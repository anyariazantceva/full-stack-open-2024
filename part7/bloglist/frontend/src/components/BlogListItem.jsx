import { Link } from "react-router-dom";
import { ListGroup } from "react-bootstrap";

const BlogListItem = ({ blog }) => {
  return (
    <ListGroup.Item>
      <strong>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </strong>
    </ListGroup.Item>
  );
};

export default BlogListItem;
