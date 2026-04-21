const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

// Naya function: Sabse zyada likes wala blog dhoondhne ke liye
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  // reduce ka use karke max likes wala object nikala
  const favorite = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current;
  });

  // Humein saari details nahi chahiye, sirf ye 3 cheezein chahiye
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog, // Naye function ko yahan export karna zaroori hai
};


