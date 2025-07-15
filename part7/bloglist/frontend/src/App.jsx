import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import UserBlogs from "./components/UserBlogs";
import Notification from "./components/Notification";
import BlogsForm from "./components/BlogsForm";
import Togglable from "./components/Togglable";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "./reducers/notificationsReducer";
import {
  initializeBlogs,
  createBlog as createBlogAction,
  deleteBlog,
  setBlogs,
  updateBlog,
} from "./reducers/blogsReducer";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const notification = useSelector((state) => state.notification);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (exception) {
      dispatch(setNotification("Wrong username or password", "error"));
    }
  };

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    try {
      await dispatch(createBlogAction(newBlog));
      dispatch(
        setNotification(
          `A new blog ${newBlog.title} by ${createBlog.user.username} added`,
          "success"
        )
      );
    } catch (exception) {
      dispatch(setNotification("Failed to create a blog", "error"));
    }
  };

  const likeBlog = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      await dispatch(updateBlog(updatedBlog));
    } catch (error) {
      dispatch(setNotification("Failed to like blog", "error"));
    }
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await dispatch(deleteBlog(blog.id));
      } catch (error) {
        dispatch(setNotification("Failed to delete blog", "error"));
      }
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

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
        </div>
      )}
    </div>
  );
};

export default App;
