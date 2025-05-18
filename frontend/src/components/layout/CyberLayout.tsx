import type React from "react"
import { Link } from "react-router-dom"
import { isAuthenticated, isAdmin, getUserName } from "../../utils/auth"
import { UserMenu } from "../UserMenu"

interface NavLink {
  to: string
  label: string
}

interface CyberLayoutProps {
  children: React.ReactNode
}

const CyberLayout: React.FC<CyberLayoutProps> = ({ children }) => {
  const authenticated = isAuthenticated()
  const admin = isAdmin()
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
        { to: "/mis-actividades", label: "Mis Actividades" },
        { to: "/nueva-actividad", label: "Nueva Actividad" }
      ]
    }

    return [
      { to: "/", label: "Inicio" },
      { to: "/mis-actividades", label: "Mis Actividades" }
    ]
  }

  return (
    <div className="sport-layout">
      <nav className="sport-navbar">
        <div className="sport-logo">CYBER GYM</div>
        <div className="sport-nav-links">
          {getNavLinks().map((link, index) => (
            <Link key={index} to={link.to} className="sport-nav-link">
              {link.label}
            </Link>
          ))}
          {authenticated && <UserMenu userName={userName} />}
        </div>
      </nav>

      <main className="sport-main">
        {children}
      </main>

      <footer className="sport-footer">
        <div className="sport-footer-text">
          © {new Date().getFullYear()} CYBER GYM
        </div>
      </footer>
    </div>
  )
}

export default CyberLayout
