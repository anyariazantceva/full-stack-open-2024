import { useState } from "react";
import { Form, Button } from "react-bootstrap";

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
    <Form onSubmit={handleBlogSubmit}>
      <Form.Group>
        <Form.Label> title:</Form.Label>
        <Form.Control
          data-testid="title"
          id="title"
          type="text"
          value={newBlog.title}
          name="title"
          onChange={handleFormChange}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label> author:</Form.Label>
        <Form.Control
          data-testid="author"
          id="author"
          type="text"
          value={newBlog.author}
          name="author"
          onChange={handleFormChange}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label> url:</Form.Label>
        <Form.Control
          data-testid="url"
          id="url"
          type="text"
          value={newBlog.url}
          name="url"
          onChange={handleFormChange}
        ></Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        create
      </Button>
    </Form>
  );
};

export default BlogsForm;
