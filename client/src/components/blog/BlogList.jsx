import BlogCard from './BlogCard'

export default function BlogList({ posts = [] }) {
  return (
    <div className="blog-list">
      {posts.map(post => <BlogCard key={post.id} post={post} />)}
    </div>
  )
}
