import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import UserBlogs from "./components/UserBlogs";
import Notification from "./components/Notification";
import BlogsForm from "./components/BlogsForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
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
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs);
    });
  }, []);

  const showAndHideNotification = (notification) => {
    setNotification(notification);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      blogService.getAll().then((blogs) => setBlogs(blogs));
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
    } catch (exception) {
      showAndHideNotification({
        message: "Wrong username or password",
        type: "error",
      });
    }
  };

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(createdBlog));
      showAndHideNotification({
        message: `A new blog ${createdBlog.title} by ${createBlog.user.username} added`,
        type: "success",
      });
    } catch (exception) {
      showAndHideNotification({
        message: "Failed to create a blog",
        type: "error",
      });
    }
  };

  const sortBlogsByLikes = (blogs) => {
    return [...blogs].sort((a, b) => b.likes - a.likes);
  };

  const likeBlog = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    const likedBlog = await blogService.update(updatedBlog, blog.id);
    setBlogs((prevBlogs) =>
      sortBlogsByLikes(
        prevBlogs.map((b) => (b.id === likedBlog.id ? likedBlog : b))
      )
    );
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs((prevBlogs) =>
          prevBlogs.filter((prevBlog) => prevBlog.id !== blog.id)
        );
      } catch (error) {
        console.error("Error deleting blog:", error);
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
