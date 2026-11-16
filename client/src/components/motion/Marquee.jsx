/**
 * Marquee — an endlessly scrolling strip. Content is rendered twice and the
 * track slides by exactly half its width, so the loop is seamless.
 * Pauses on hover and stands still for reduced-motion users (see globals.css).
 */
export default function Marquee({ items = [], speed = 40, className = "", label }) {
  const renderSet = (hidden) => (
    <ul className="marquee-set" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="marquee-item">
          <span>{item}</span>
          <span className="marquee-dot" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`marquee ${className}`} aria-label={label} role={label ? "region" : undefined}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {renderSet(false)}
        {renderSet(true)}
      </div>
    </div>
  );
}
