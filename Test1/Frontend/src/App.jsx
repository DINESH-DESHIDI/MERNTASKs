import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  async function fetchPosts() {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        throw new Error('Could not load posts from the server.');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to fetch posts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function createSamplePost() {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Sample Blog Post',
          content: 'This post was created from the frontend to verify the backend.'
        })
      });

      if (!response.ok) {
        throw new Error('Unable to create a sample post.');
      }

      await fetchPosts();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create sample post.');
    }
  }

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>Simple Blog Viewer</h1>
          <p>Use this page to verify your backend is working and see saved blog posts.</p>
        </div>

        <div className="button-row">
          <button onClick={fetchPosts}>Refresh</button>
          <button onClick={createSamplePost}>Create Sample Post</button>
        </div>
      </header>

      {loading && <p>Loading posts…</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {!loading && !errorMessage && posts.length === 0 && <p>No posts found yet. Click “Create Sample Post” to add one.</p>}

      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post._id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.content || 'No content available.'}</p>
            <small>Created: {new Date(post.createdAt).toLocaleString()}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

export default App;
