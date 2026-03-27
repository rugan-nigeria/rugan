import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
  return (
    <div className="blog-card">
      <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
    </div>
  )
}
