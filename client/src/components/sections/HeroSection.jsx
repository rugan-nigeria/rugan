export default function HeroSection({ title, subtitle, cta }) {
  return (
    <section className="hero">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {cta && cta}
    </section>
  )
}
