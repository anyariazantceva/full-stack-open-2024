var _ = require('lodash');

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  let totalLikes = blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0);
  return totalLikes;
}

const favoriteBlog = (blogs) => {
  let mostLikes = 0;
  let mostFavoriteBlog = {};
  if (blogs.length === 0) return null
  blogs.forEach((blog) => {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes;
      mostFavoriteBlog = blog;
    }
  });
  return mostFavoriteBlog;
}

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author');
  const authorsWithBlogCount = _.map(groupedByAuthor, (blogs, author) => {
    return { author, blogs: blogs.length };
  });
  const authorWithMostBlogs = _.maxBy(authorsWithBlogCount, 'blogs');
  return authorWithMostBlogs;
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author');
  const authorsWithLikes = _.map(groupedByAuthor, (blogs, author) => {
    const totalLikes = _.sumBy(blogs, 'likes')
    return { author, likes: totalLikes };
  })
  const authorWithMostLikes = _.maxBy(authorsWithLikes, 'likes');
  return authorWithMostLikes;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}