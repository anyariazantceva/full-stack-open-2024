import BlogListItem from "./BlogListItem";
import Togglable from "./Togglable";
import BlogsForm from "./BlogsForm";

const UserBlogs = ({ blogs, blogFormRef, createBlog }) => {
  return (
    <div>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogsForm createBlog={createBlog} />
      </Togglable>
      {blogs?.length > 0 ? (
        blogs.map((blog) => <BlogListItem key={blog.id} blog={blog} />)
      ) : (
        <p className="text-gray-500">No blogs available</p>
      )}
    </div>
  );
};

export default UserBlogs;
