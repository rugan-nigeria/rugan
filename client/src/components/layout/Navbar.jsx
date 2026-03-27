import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
      <Link to="/">RUGAN</Link>
      <ul>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/programs">Programs</NavLink></li>
        <li><NavLink to="/impact">Impact</NavLink></li>
        <li><NavLink to="/blog">Blog</NavLink></li>
        <li><NavLink to="/volunteer">Volunteer</NavLink></li>
        <li><NavLink to="/partner">Partner</NavLink></li>
        <li><NavLink to="/donate">Donate</NavLink></li>
      </ul>
    </nav>
  )
}
