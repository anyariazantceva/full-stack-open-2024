import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [showBlog, setShowBlog] = useState(false)
  const handleClick = () => {
    setShowBlog((prev) => !prev)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const buttonTitle = showBlog ? 'hide' : 'show'
  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={handleClick}>{buttonTitle}</button>
      {showBlog ? (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button onClick={() => likeBlog(blog)}>like</button>
          </p>
          <p>{blog.author}</p>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
}

export default Blog
