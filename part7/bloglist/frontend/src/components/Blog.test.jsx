import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

let component;
const blog = {
  title: "Test blog",
  author: "Bob Smith",
  url: "test.com",
  likes: 1,
  user: {
    username: "testUser",
    name: "Test User",
  },
};

const likeHandler = vi.fn();

beforeEach(() => {
  component = render(<Blog blog={blog} likeBlog={likeHandler} />);
});

test("should show blog title and author but not url and likes by default", () => {
  expect(component.container).toHaveTextContent(blog.title);
  expect(component.container).toHaveTextContent(blog.author);
  expect(component.container).not.toHaveTextContent(blog.url);
  expect(component.container).not.toHaveTextContent(blog.likes);
});

test("Blog url and number of likes are shown when the button has been clicked", async () => {
  const user = userEvent.setup();
  const button = screen.getByText("show");
  await user.click(button);
  expect(component.container).toHaveTextContent(blog.url);
  expect(component.container).toHaveTextContent(blog.likes);
});

test("Like button is clicked twice", async () => {
  const user = userEvent.setup();
  const showButton = screen.getByText("show");
  await user.click(showButton);
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);
  expect(likeHandler.mock.calls).toHaveLength(2);
});
