import LoginForm from "./LoginForm";
import UserBlogs from "./UserBlogs";
import Notification from "./Notification";
import Users from "./Users";

const Home = ({
  notification,
  user,
  handleLogin,
  createBlog,
  blogs,
  blogFormRef,
}) => {
  return (
    <div>
      <Notification notification={notification} />
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <UserBlogs
            blogs={blogs}
            blogFormRef={blogFormRef}
            createBlog={createBlog}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
