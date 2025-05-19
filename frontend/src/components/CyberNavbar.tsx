import type React from "react"
import { Link } from "react-router-dom"
import { UserMenu } from "./UserMenu"
import type { NavLink } from "../types"
import { isAuthenticated, isAdmin, isInstructor, getUserName } from "../utils/auth"

interface CyberNavbarProps {
  logo?: string
}

const CyberNavbar: React.FC<CyberNavbarProps> = ({ logo = "CYBER GYM" }) => {
  const authenticated = isAuthenticated()
  const admin = isAdmin()
  const instructor = isInstructor()
  const userName = getUserName()

  const getNavLinks = () => {
    if (!authenticated) {
      return [
        { to: "/", label: "Inicio" },
        { to: "/login", label: "Iniciar Sesión" },
        { to: "/signup", label: "Registrarse" }
      ]
    }

    if (admin) {
      return [
        { to: "/", label: "Inicio" },
        { to: "/admin/actividades", label: "Gestionar Actividades" },
        { to: "/admin/instructores", label: "Gestionar Instructores" }
      ]
    }

    if (instructor) {
      return [
        { to: "/mis-actividades", label: "Mis Actividades" }
      ]
    }

    return [
      { to: "/", label: "Inicio" },
      { to: "/mis-actividades", label: "Mis Actividades" }
    ]
  }

  return (
    <nav className="cyber-navbar">
      <div className="cyber-logo glitch-effect">{logo}</div>
      <div className="cyber-nav-links">
        {getNavLinks().map((link, index) => (
          <Link key={index} to={link.to} className="cyber-nav-link">
            {link.label}
          </Link>
        ))}
        {authenticated && <UserMenu userName={userName} />}
      </div>
    </nav>
  )
}

export default CyberNavbar
