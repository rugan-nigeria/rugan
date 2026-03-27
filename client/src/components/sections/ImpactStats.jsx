export default function ImpactStats({ stats = [] }) {
  return (
    <section className="impact-stats">
      {stats.map((stat, i) => (
        <div key={i} className="stat">
          <h2>{stat.value}</h2>
          <p>{stat.label}</p>
        </div>
      ))}
    </section>
  )
}
