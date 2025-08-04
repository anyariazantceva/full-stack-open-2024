import { useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import usersService from "./services/users";
import Home from "./components/Home";
import User from "./components/User";
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

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Blog from "./components/Blog";
import UserBlogs from "./components/UserBlogs";
import Users from "./components/Users";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

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
    <Router>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Nav>
          <Nav.Item>
            <Link to={"/blogs"}>
              <span style={{ paddingRight: 10 }}>blogs</span>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to={"/users"}>
              <span style={{ paddingRight: 10 }}>users</span>
            </Link>
          </Nav.Item>
          {user && (
            <>
              <div>{user.name} logged in</div>
              <Button onClick={handleLogout}>logout</Button>
            </>
          )}
        </Nav>
      </Navbar>

      <h2>Blog app</h2>

      <Routes>
        <Route
          path="/blogs"
          element={
            <UserBlogs
              blogs={blogs}
              blogFormRef={blogFormRef}
              createBlog={createBlog}
            />
          }
        />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<User users={users} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog blogs={blogs} removeBlog={removeBlog} likeBlog={likeBlog} />
          }
        />
        <Route
          path="/"
          element={
            <Home
              notification={notification}
              user={user}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              likeBlog={likeBlog}
              createBlog={createBlog}
              blogs={blogs}
              removeBlog={removeBlog}
              users={users}
              blogFormRef={blogFormRef}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
