import BlogListItem from "./BlogListItem";
import Togglable from "./Togglable";
import BlogsForm from "./BlogsForm";
import { ListGroup } from "react-bootstrap";

const UserBlogs = ({ blogs, blogFormRef, createBlog }) => {
  return (
    <div>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogsForm createBlog={createBlog} />
      </Togglable>
      <ListGroup>
        {blogs?.length > 0 ? (
          blogs.map((blog) => <BlogListItem key={blog.id} blog={blog} />)
        ) : (
          <ListGroup.Item> No blogs available</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default UserBlogs;
