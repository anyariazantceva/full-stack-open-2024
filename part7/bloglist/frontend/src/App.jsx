import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import usersService from "./services/users";
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
  updateBlog,
} from "./reducers/blogsReducer";
import { initializeUsers } from "./reducers/usersReducer";
import { setUser, clearUser } from "./reducers/userReducer";
import Users from "./components/Users";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.users);
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch]);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      dispatch(setUser(user));
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      usersService.setToken(user.token);
      dispatch(initializeUsers());
      dispatch(initializeBlogs());
    } catch (exception) {
      dispatch(setNotification("Wrong username or password", "error"));
    }
  };

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    try {
      const result = await dispatch(createBlogAction(newBlog));
      const createdBlog = result.payload;
      dispatch(
        setNotification(
          `A new blog ${createdBlog.title} by ${createdBlog.user.username} added`,
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
    dispatch(clearUser());
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

          <h2>Users</h2>
          <Users users={users} />
        </div>
      )}
    </div>
  );
};

export default App;
