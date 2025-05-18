import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { UserMenu } from "./UserMenu"
import type { NavLink } from "../types"

interface CyberNavbarProps {
  links?: NavLink[]
  logo?: string
}

const CyberNavbar: React.FC<CyberNavbarProps> = ({ links = [], logo = "CYBER GYM" }) => {
  const { isAuthenticated, isAdmin, user } = useAuth()

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: "/", label: "Inicio" },
        { to: "/login", label: "Iniciar Sesión" },
        { to: "/signup", label: "Registrarse" },
      ]
    }

    const baseLinks = [
      { to: "/", label: "Inicio" },
      { to: "/mis-actividades", label: "Mis Actividades" },
    ]

    if (isAdmin) {
      baseLinks.push({ to: "/nueva-actividad", label: "Nueva Actividad" })
    }

    return baseLinks
  }

  const navLinks = links.length > 0 ? links : getNavLinks()

  return (
    <nav className="cyber-navbar">
      <div className="cyber-logo glitch-effect">{logo}</div>
      <div className="cyber-nav-links">
        {navLinks.map((link, index) => (
          <Link key={index} to={link.to} className="cyber-nav-link">
            {link.label}
          </Link>
        ))}
        {isAuthenticated && <UserMenu />}
      </div>
    </nav>
  )
}

export default CyberNavbar
