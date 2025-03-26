import { render, screen } from "@testing-library/react";
import BlogsForm from "./BlogsForm";
import userEvent from "@testing-library/user-event";

test("BlogsForm updates parent state and calls onSubmit", async () => {
  const newBlog = {
    title: "Test blog",
    author: "Bob Smith",
    url: "test@blog.com",
  };
  const createBlog = vi.fn();
  const user = userEvent.setup();
  const component = render(<BlogsForm createBlog={createBlog} />);
  const titleInput = component.container.querySelector("#title");
  const authorInput = component.container.querySelector("#author");
  const urlInput = component.container.querySelector("#url");
  const sendButton = component.getByText("create");
  await user.type(titleInput, newBlog.title);
  await user.type(authorInput, newBlog.author);
  await user.type(urlInput, newBlog.url);
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual(newBlog);
});
