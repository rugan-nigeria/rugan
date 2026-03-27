export default function BlogFilter({ categories = [], onFilter }) {
  return (
    <div className="blog-filter">
      <button onClick={() => onFilter(null)}>All</button>
      {categories.map(cat => (
        <button key={cat} onClick={() => onFilter(cat)}>{cat}</button>
      ))}
    </div>
  )
}
