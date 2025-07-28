import BlogListItem from "./BlogListItem";

const UserBlogs = ({ username, blogs, handleLogout, likeBlog, removeBlog }) => {
  return (
    <div>
      <p>{username}</p>
      {blogs?.length > 0 ? (
        blogs.map((blog) => (
          <BlogListItem
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
        ))
      ) : (
        <p className="text-gray-500">No blogs available</p>
      )}
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default UserBlogs;
