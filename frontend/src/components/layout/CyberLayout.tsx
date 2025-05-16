import type React from "react"
import SportNavbar from "./CyberNavbar"
import SportFooter from "./CyberFooter"

interface SportLayoutProps {
  children: React.ReactNode
}

export const SportLayout: React.FC<SportLayoutProps> = ({ children }) => {
  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/mis-actividades", label: "Mis Actividades" },
    { to: "/nueva-actividad", label: "Nueva Actividad" },
    { to: "/login", label: "Login" },
  ]

  const footerLinks = [
    { to: "/terminos", label: "Términos" },
    { to: "/privacidad", label: "Privacidad" },
    { to: "/contacto", label: "Contacto" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SportNavbar links={navLinks} />
      <main className="flex-grow sport-main">{children}</main>
      <SportFooter links={footerLinks} />
    </div>
  )
}

export default SportLayout
