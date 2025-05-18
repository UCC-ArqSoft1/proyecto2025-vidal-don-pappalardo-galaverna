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
  const { isAuthenticated, isAdmin } = useAuth()

  // Solo usamos los links personalizados si se proporcionan explícitamente
  // y el usuario está autenticado
  if (links.length > 0 && isAuthenticated) {
    return (
      <nav className="cyber-navbar">
        <div className="cyber-logo glitch-effect">{logo}</div>
        <div className="cyber-nav-links">
          {links.map((link, index) => (
            <Link key={index} to={link.to} className="cyber-nav-link">
              {link.label}
            </Link>
          ))}
          <UserMenu />
        </div>
      </nav>
    )
  }

  // Links por defecto basados en el estado de autenticación
  const defaultLinks = !isAuthenticated
    ? [
        { to: "/", label: "Inicio" },
        { to: "/login", label: "Iniciar Sesión" },
        { to: "/signup", label: "Registrarse" },
      ]
    : [
        { to: "/", label: "Inicio" },
        { to: "/mis-actividades", label: "Mis Actividades" },
        ...(isAdmin ? [{ to: "/nueva-actividad", label: "Nueva Actividad" }] : []),
      ]

  return (
    <nav className="cyber-navbar">
      <div className="cyber-logo glitch-effect">{logo}</div>
      <div className="cyber-nav-links">
        {defaultLinks.map((link, index) => (
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
