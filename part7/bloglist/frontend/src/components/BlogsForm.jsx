import { useState } from "react";

const BlogsForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setNewBlog((newBlog) => ({
      ...newBlog,
      [name]: value,
    }));
  };
  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    const success = await createBlog(newBlog);
    if (success) setNewBlog({ title: "", author: "", url: "" });
  };

  return (
    <form onSubmit={handleBlogSubmit}>
      <div>
        title:
        <input
          data-testid="title"
          id="title"
          type="text"
          value={newBlog.title}
          name="title"
          onChange={handleFormChange}
        />
      </div>
      <div>
        author:
        <input
          data-testid="author"
          id="author"
          type="text"
          value={newBlog.author}
          name="author"
          onChange={handleFormChange}
        />
      </div>
      <div>
        url:
        <input
          data-testid="url"
          id="url"
          type="text"
          value={newBlog.url}
          name="url"
          onChange={handleFormChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogsForm;
