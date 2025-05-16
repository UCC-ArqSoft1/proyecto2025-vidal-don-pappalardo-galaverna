import type React from "react"
import { Link } from "react-router-dom"

interface NavLink {
  to: string
  label: string
}

interface SportNavbarProps {
  logo?: string
  links: NavLink[]
}

export const SportNavbar: React.FC<SportNavbarProps> = ({ logo = "SPORT GYM", links }) => {
  return (
    <nav className="sport-navbar">
      <div className="sport-logo">{logo}</div>
      <div className="sport-nav-links">
        {links.map((link, index) => (
          <Link key={index} to={link.to} className="sport-nav-link">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default SportNavbar
