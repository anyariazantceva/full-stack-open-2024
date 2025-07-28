import LoginForm from "./LoginForm";
import UserBlogs from "./UserBlogs";
import Notification from "./Notification";
import BlogsForm from "./BlogsForm";
import Togglable from "./Togglable";
import Users from "./Users";

const Home = ({
  notification,
  user,
  handleLogin,
  handleLogout,
  likeBlog,
  createBlog,
  blogs,
  removeBlog,
  users,
  blogFormRef,
}) => {
  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <UserBlogs
            username={user.name}
            blogs={blogs}
            handleLogout={handleLogout}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
          <Togglable buttonLabel="New blog" ref={blogFormRef}>
            <BlogsForm createBlog={createBlog} />
          </Togglable>

          <h2>Users</h2>
          <Users users={users} />
        </div>
      )}
    </div>
  );
};

export default Home;
