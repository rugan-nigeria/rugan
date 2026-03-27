export default function TeamGrid({ members = [] }) {
  return (
    <section className="team-grid">
      {members.map((member, i) => (
        <div key={i} className="team-card">
          <img src={member.photo} alt={member.name} />
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
      ))}
    </section>
  )
}
