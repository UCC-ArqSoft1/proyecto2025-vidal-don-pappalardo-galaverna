import type React from "react"
import { Link } from "react-router-dom"
import { UserMenu } from "./UserMenu"
import type { NavLink } from "../types"
import { isAuthenticated, isAdmin } from "../utils/auth"

interface CyberNavbarProps {
  links?: NavLink[]
  logo?: string
}

const CyberNavbar: React.FC<CyberNavbarProps> = ({ links = [], logo = "CYBER GYM" }) => {
  // Obtener el estado de autenticación directamente de las utilidades
  const authenticated = isAuthenticated()
  const admin = isAdmin()

  // Links por defecto basados en el estado de autenticación
  const defaultLinks = !authenticated
    ? [
        { to: "/", label: "Inicio" },
        { to: "/login", label: "Iniciar Sesión" },
        { to: "/signup", label: "Registrarse" },
      ]
    : [
        { to: "/", label: "Inicio" },
        { to: "/mis-actividades", label: "Mis Actividades" },
        ...(admin ? [{ to: "/nueva-actividad", label: "Nueva Actividad" }] : []),
      ]

  // Si se proporcionan links personalizados y el usuario está autenticado, usarlos
  const navLinks = links.length > 0 && authenticated ? links : defaultLinks

  return (
    <nav className="cyber-navbar">
      <div className="cyber-logo glitch-effect">{logo}</div>
      <div className="cyber-nav-links">
        {navLinks.map((link, index) => (
          <Link key={index} to={link.to} className="cyber-nav-link">
            {link.label}
          </Link>
        ))}
        {authenticated && <UserMenu />}
      </div>
    </nav>
  )
}

export default CyberNavbar
