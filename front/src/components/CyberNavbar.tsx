import type React from "react"
import { Link } from "react-router-dom"
import type { NavLink } from "../types"

interface CyberNavbarProps {
  links?: NavLink[]
  logo?: string
}

const CyberNavbar: React.FC<CyberNavbarProps> = ({ links = [], logo = "CYBER GYM" }) => {
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
