import type React from "react"
import { Link } from "react-router-dom"

interface NavLink {
  to: string
  label: string
}

interface CyberNavbarProps {
  logo?: string
  links: NavLink[]
}

export const CyberNavbar: React.FC<CyberNavbarProps> = ({ logo = "CYBER GYM", links }) => {
  return (
    <nav className="cyber-navbar">
      <div className="cyber-logo glitch-effect">{logo}</div>
      <div className="cyber-nav-links">
        {links.map((link, index) => (
          <Link key={index} to={link.to} className="cyber-nav-link">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default CyberNavbar
